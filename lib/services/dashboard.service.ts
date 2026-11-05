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

export async function getDashboardData(): Promise<DashboardRealtimeData> {
  let summary = { ...dashboardSummary };
  let livePayments = [...pendingPayments];
  let liveActivities = [...activities];
  let liveAnnouncements = [...announcements];
  let liveWelcome = currentUser.welcomeName;
  let liveLocation = currentUser.location;

  try {
    // 1. Ambil data profil admin aktif dari backend
    const meRes = await apiFetch<any>("/api/auth/me");
    if (meRes.data) {
      liveWelcome = meRes.data.name || currentUser.welcomeName;
    }

    // 2. Ambil data pengumuman riil dari backend (/api/announcements)
    const annRes = await apiFetch<any[]>("/api/announcements", { requireAuth: false });
    let announcementActivities: ActivityItem[] = [];

    if (Array.isArray(annRes.data) && annRes.data.length > 0) {
      const dbAnnouncements: AnnouncementItem[] = annRes.data.map((item: any) => {
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
          category: (item.category || "UMUM").toUpperCase(),
          categoryBadge: item.urgency === "darurat" ? "Darurat / Mendesak" : (item.urgency === "agenda" ? "Agenda Warga" : "Baru Terbit"),
          title: item.title,
          dateMeta,
          targetMeta: item.location ? `Lokasi: ${item.location}` : (item.targetWarga ? `Target: ${item.targetWarga}` : "Target: Seluruh Warga RT 04"),
          readMeta: "Terkirim ke Warga",
          badgeTone,
        };
      });

      // Gabungkan pengumuman dari DB di posisi paling atas
      liveAnnouncements = [...dbAnnouncements, ...announcements];

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
    const statsRes = await apiFetch<any>("/api/stats");
    if (statsRes.data) {
      const stats = statsRes.data;
      if (stats.users?.total !== undefined) {
        summary.totalUnits = Math.max(stats.users.total, summary.totalUnits);
      }

      // Gabungkan log akses gerbang terbaru dari backend ke aktivitas live dashboard
      if (Array.isArray(stats.accessLogs?.recent) && stats.accessLogs.recent.length > 0) {
        backendAccessLogs = stats.accessLogs.recent.map((log: any) => ({
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
    const paymentsRes = await apiFetch<any>("/api/payments/admin/list", { requireAuth: false });
    if (paymentsRes.data && Array.isArray(paymentsRes.data)) {
      livePayments = [...paymentsRes.data, ...pendingPayments];
      if (paymentsRes.summary) {
        summary.collected += paymentsRes.summary.totalCollected || 0;
        summary.paidUnits += paymentsRes.summary.settledCount || 0;
        summary.qrisUnits += paymentsRes.summary.qrisCount || 0;
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
