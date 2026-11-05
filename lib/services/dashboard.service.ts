import { apiFetch } from "@/lib/api";
import { activities, announcements, currentUser, dashboardSummary, pendingPayments, type AnnouncementItem } from "@/lib/data";
import type { ActivityItem, DashboardSummary, PendingPayment } from "@/lib/types";

export interface DashboardRealtimeData {
  summary: DashboardSummary;
  payments: PendingPayment[];
  activities: ActivityItem[];
  announcements: AnnouncementItem[];
  welcomeName: string;
  location: string;
}

interface BackendUserMe {
  name?: string;
}

interface BackendAnnouncement {
  id: number | string;
  category?: string;
  urgency?: string;
  title: string;
  content?: string;
  authorName?: string;
  createdAt?: string;
  location?: string;
  targetWarga?: string;
  eventDate?: string;
  eventTime?: string;
}

interface BackendStats {
  users?: { total?: number };
  accessLogs?: {
    recent?: Array<{
      id: number | string;
      action: "OPEN" | "CLOSE" | "DENIED" | string;
      timestamp: string;
      gate?: { name?: string };
      user?: { name?: string };
    }>;
  };
}

interface BackendPaymentsResponse {
  data?: PendingPayment[];
  summary?: {
    totalCollected?: number;
    settledCount?: number;
    qrisCount?: number;
  };
}

export async function getDashboardData(): Promise<DashboardRealtimeData> {
  const summary = { ...dashboardSummary };
  let livePayments = [...pendingPayments];
  let liveActivities = [...activities];
  let liveAnnouncements = [...announcements];
  let liveWelcome = currentUser.welcomeName;
  const liveLocation = currentUser.location;

  try {
    // 1. Ambil data profil admin aktif dari backend
    const meRes = await apiFetch<BackendUserMe>("/api/auth/me");
    if (meRes.data?.name) {
      liveWelcome = meRes.data.name;
    }

    // 2. Ambil data pengumuman riil dari backend (/api/announcements)
    const annRes = await apiFetch<BackendAnnouncement[]>("/api/announcements", { requireAuth: false });
    let announcementActivities: ActivityItem[] = [];

    if (Array.isArray(annRes.data) && annRes.data.length > 0) {
      const dbAnnouncements: AnnouncementItem[] = annRes.data.map((item) => {
        let badgeTone: "green" | "indigo" | "rose" = "indigo";
        if (item.urgency === "darurat" || item.urgency === "penting") badgeTone = "rose";
        else if (item.urgency === "biasa") badgeTone = "green";

        let dateMeta = `Baru saja • oleh ${item.authorName || "Admin"}`;
        if (item.createdAt) {
          const d = new Date(item.createdAt);
          dateMeta = `${d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}, ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB • oleh ${item.authorName || "Admin"}`;
        }

        return {
          id: `db-ann-${item.id}`,
          dbId: item.id,
          category: (item.category || "UMUM").toUpperCase(),
          categoryBadge: item.urgency === "darurat" ? "Darurat / Mendesak" : (item.urgency === "agenda" ? "Agenda Warga" : "Baru Terbit"),
          title: item.title,
          content: item.content,
          location: item.location,
          eventDate: item.eventDate,
          eventTime: item.eventTime,
          targetWarga: item.targetWarga,
          authorName: item.authorName || "Admin",
          urgency: item.urgency,
          dateMeta,
          targetMeta: item.location ? `Lokasi: ${item.location}` : (item.targetWarga ? `Target: ${item.targetWarga}` : "Target: Seluruh Warga RT 04"),
          readMeta: "Terkirim ke Warga",
          badgeTone,
        };
      });

      // Tampilkan pengumuman murni dari database (bukan dummy)
      liveAnnouncements = dbAnnouncements;

      // Jadikan pengumuman terbaru sebagai bagian dari "Aktivitas Terbaru"
      announcementActivities = dbAnnouncements.map((ann) => ({
        id: `act-${ann.id}`,
        kind: "announcement" as const,
        title: "Pengumuman Terbit",
        description: `"${ann.title}".`,
        meta: ann.dateMeta,
      }));
    }

    // 3. Ambil data statistik riil dari backend (/api/stats)
    let backendAccessLogs: ActivityItem[] = [];
    const statsRes = await apiFetch<BackendStats>("/api/stats");
    if (statsRes.data) {
      const stats = statsRes.data;
      if (stats.users?.total !== undefined) {
        summary.totalUnits = Math.max(stats.users.total, summary.totalUnits);
      }

      // Gabungkan log akses gerbang terbaru dari backend ke aktivitas live dashboard
      if (Array.isArray(stats.accessLogs?.recent) && stats.accessLogs.recent.length > 0) {
        backendAccessLogs = stats.accessLogs.recent.map((log) => ({
          id: `log-${log.id}`,
          kind: log.action === "OPEN" ? "approved" : "reminder",
          title: `Akses Gerbang ${log.gate?.name || "Utama"} (${log.action})`,
          description: `Pengguna ${log.user?.name || "Warga"} mengakses gerbang.`,
          meta: new Date(log.timestamp).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB • Sistem GateLand",
        }));
      }
    }

    // 4. Ambil data pembayaran & QRIS dari backend (/api/payments/admin/list)
    const paymentsRes = await apiFetch<BackendPaymentsResponse | PendingPayment[]>("/api/payments/admin/list", { requireAuth: false });
    if (paymentsRes.data) {
      if (Array.isArray(paymentsRes.data)) {
        livePayments = [...paymentsRes.data, ...pendingPayments];
      } else if (Array.isArray(paymentsRes.data.data)) {
        livePayments = [...paymentsRes.data.data, ...pendingPayments];
        if (paymentsRes.data.summary) {
          summary.collected += paymentsRes.data.summary.totalCollected || 0;
          summary.paidUnits += paymentsRes.data.summary.settledCount || 0;
          summary.qrisUnits += paymentsRes.data.summary.qrisCount || 0;
        }
      }
    }

    // Susun urutan timeline aktivitas: Pengumuman terbaru paling atas, disusul log gerbang & aktivitas lainnya
    liveActivities = [...announcementActivities, ...backendAccessLogs, ...activities].slice(0, 5);

  } catch (err) {
    console.warn("Backend offline atau error saat fetch dashboard, menggunakan data cache:", err);
  }

  return {
    summary,
    payments: livePayments,
    activities: liveActivities,
    announcements: liveAnnouncements,
    welcomeName: liveWelcome,
    location: liveLocation,
  };
}
