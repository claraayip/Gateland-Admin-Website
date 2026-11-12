import { apiFetch } from "@/lib/api";
import { currentUser, type AnnouncementItem } from "@/lib/data";
import { formatRupiah } from "@/lib/format";
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
  users?: {
    total?: number;
    recent?: Array<{
      id: number | string;
      name: string;
      email?: string | null;
      whatsapp?: string | null;
      address?: string | null;
      isVerified?: boolean;
      createdAt?: string;
    }>;
  };
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
    unpaidCount?: number;
    unpaidAmount?: number;
    paidBillsCount?: number;
    totalBilledAmount?: number;
    totalBillsCount?: number;
  };
}

interface BackendBill {
  id: number;
  userId?: number | null;
  residentName: string;
  unit: string;
  month: string;
  description?: string | null;
  amount: number;
  status: "UNPAID" | "PAID" | string;
  dueDate?: string | null;
  createdAt?: string;
}

type TimedActivity = ActivityItem & { sortTime: number };

export async function getDashboardData(): Promise<DashboardRealtimeData> {
  const summary: DashboardSummary = {
    period: "November 2026",
    collected: 0,
    target: 0,
    growthLabel: "Belum ada tagihan",
    paidUnits: 0,
    totalUnits: 0,
    qrisUnits: 0,
    overdueUnits: 0,
    overdueAmount: 0,
  };
  let livePayments: PendingPayment[] = [];
  let liveActivities: ActivityItem[] = [];
  let liveAnnouncements: AnnouncementItem[] = [];
  let liveWelcome = currentUser.welcomeName;
  const liveLocation = "Cluster GateLand";

  try {
    // 1. Ambil profil admin aktif
    const meRes = await apiFetch<BackendUserMe>("/api/auth/me");
    if (meRes.data?.name) {
      liveWelcome = meRes.data.name;
    }

    // 2. Ambil pengumuman riil dari database (/api/announcements)
    const annRes = await apiFetch<BackendAnnouncement[]>("/api/announcements", { requireAuth: false });
    let announcementActivities: TimedActivity[] = [];

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
          targetMeta: item.location ? `Lokasi: ${item.location}` : (item.targetWarga ? `Target: ${item.targetWarga}` : "Target: Seluruh Warga GateLand"),
          readMeta: "Terkirim ke Warga",
          badgeTone,
        };
      });

      liveAnnouncements = dbAnnouncements;
      announcementActivities = annRes.data.map((item, idx) => ({
        id: `act-db-ann-${item.id}`,
        kind: "announcement" as const,
        title: "Pengumuman Terbit",
        description: `"${item.title}".`,
        meta: dbAnnouncements[idx]?.dateMeta || "Baru saja • oleh Admin",
        sortTime: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
      }));
    }

    // 3. Ambil statistik user terdaftar & log akses dari /api/stats
    let backendAccessLogs: TimedActivity[] = [];
    let recentResidentActivities: TimedActivity[] = [];
    const statsRes = await apiFetch<BackendStats>("/api/stats");
    if (statsRes.data) {
      const stats = statsRes.data;
      if (stats.users?.total !== undefined) {
        summary.totalUnits = stats.users.total;
      }

      if (Array.isArray(stats.users?.recent) && stats.users.recent.length > 0) {
        recentResidentActivities = stats.users.recent.map((u) => {
          const d = u.createdAt ? new Date(u.createdAt) : new Date();
          const timeLabel = `${d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}, ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`;
          const addrInfo = u.address ? ` (${u.address})` : "";
          const emailInfo = u.email ? ` • ${u.email}` : "";
          return {
            id: `reg-user-${u.id}`,
            kind: "new-resident" as const,
            title: "Warga Baru Terdaftar",
            description: `${u.name}${addrInfo} mendaftar akun warga${emailInfo}.`,
            meta: `${timeLabel} • ${u.isVerified === false ? "Menunggu Verifikasi Admin" : "Terverifikasi"}`,
            sortTime: d.getTime(),
          };
        });
      }

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
          sortTime: new Date(log.timestamp).getTime(),
        }));
      }
    }

    // 4. Ambil data pembayaran & tagihan riil dari backend (tanpa dummy)
    const [paymentsRes, billsRes] = await Promise.all([
      apiFetch<BackendPaymentsResponse | PendingPayment[]>("/api/payments/admin/list", { requireAuth: false }),
      apiFetch<BackendBill[]>("/api/payments/bills", { requireAuth: false }).catch(() => ({ data: [] as BackendBill[] })),
    ]);

    const txRows: PendingPayment[] = [];
    if (paymentsRes.data) {
      if (Array.isArray(paymentsRes.data)) {
        txRows.push(...paymentsRes.data);
      } else if (Array.isArray(paymentsRes.data.data)) {
        txRows.push(...paymentsRes.data.data);
        if (paymentsRes.data.summary) {
          summary.collected = paymentsRes.data.summary.totalCollected ?? 0;
          summary.qrisUnits = paymentsRes.data.summary.qrisCount ?? 0;
          summary.target = paymentsRes.data.summary.totalBilledAmount ?? 0;
          summary.paidUnits = paymentsRes.data.summary.paidBillsCount ?? 0;
          summary.overdueUnits = paymentsRes.data.summary.unpaidCount ?? 0;
          summary.overdueAmount = paymentsRes.data.summary.unpaidAmount ?? 0;
        }
      }
    }

    const billsList = Array.isArray(billsRes?.data) ? billsRes.data : [];
    const unpaidBillRows: PendingPayment[] = billsList
      .filter((b) => b.status === "UNPAID")
      .map((b) => ({
        id: `bill-${b.id}`,
        residentName: b.residentName,
        unit: b.unit || "Cluster GateLand",
        postName: `Tagihan ${b.month}`,
        amount: b.amount,
        channel: "Menunggu Pembayaran",
        submittedAgo: `Jatuh tempo: ${b.dueDate || "-"}`,
        avatarTone: "pink" as const,
        status: "UNPAID",
      }));

    if (billsList.length > 0 && summary.target === 0) {
      summary.target = billsList.reduce((sum, b) => sum + b.amount, 0);
      summary.paidUnits = billsList.filter((b) => b.status === "PAID").length;
      summary.overdueUnits = unpaidBillRows.length;
      summary.overdueAmount = unpaidBillRows.reduce((sum, b) => sum + b.amount, 0);
    }

    if (billsList.length === 0 && summary.collected > 0 && summary.paidUnits === 0) {
      summary.paidUnits = txRows.filter((t) => t.status === "SETTLEMENT").length;
    }

    summary.growthLabel = summary.target > 0
      ? `${Math.min(100, Math.round((summary.collected / summary.target) * 100))}% dari target`
      : "Belum ada tagihan dikelola";

    livePayments = [...txRows, ...unpaidBillRows];

    // 5. Kelompokkan tagihan baru dari database agar muncul di Aktivitas Terbaru beserta deskripsinya
    const billGroupMap = new Map<
      string,
      {
        title: string;
        description: string | null;
        amount: number;
        dueDate: string | null;
        count: number;
        createdAt: number;
      }
    >();

    for (const bill of billsList) {
      const createdTs = bill.createdAt ? new Date(bill.createdAt).getTime() : Date.now();
      const minuteBucket = Math.floor(createdTs / 60000);
      const groupKey = `${bill.month}::${bill.amount}::${minuteBucket}`;
      const existing = billGroupMap.get(groupKey);
      if (existing) {
        existing.count += 1;
        if (!existing.description && bill.description) existing.description = bill.description;
      } else {
        billGroupMap.set(groupKey, {
          title: bill.month,
          description: bill.description ?? null,
          amount: bill.amount,
          dueDate: bill.dueDate ?? null,
          count: 1,
          createdAt: createdTs,
        });
      }
    }

    const billActivities: TimedActivity[] = Array.from(billGroupMap.entries()).map(([key, g]) => {
      const d = new Date(g.createdAt);
      const timeLabel = `${d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}, ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`;
      const descText = g.description
        ? `${g.title} (${formatRupiah(g.amount)}) — ${g.description}`
        : `${g.title} (${formatRupiah(g.amount)}) diterbitkan untuk ${g.count} penghuni.`;

      return {
        id: `bill-act-${key}`,
        kind: "approved",
        title: `Iuran Baru Diterbitkan: ${g.title}`,
        description: descText,
        meta: `${timeLabel} • ${g.count} penghuni${g.dueDate ? ` • Jatuh tempo: ${g.dueDate}` : ""}`,
        sortTime: g.createdAt,
      };
    });

    // Gabungkan semua aktivitas & urutkan dari yang paling terbaru berdasarkan timestamp
    const mergedActivities: TimedActivity[] = [
      ...billActivities,
      ...recentResidentActivities,
      ...announcementActivities,
      ...backendAccessLogs,
    ].sort((a, b) => b.sortTime - a.sortTime);

    liveActivities = mergedActivities.slice(0, 6).map(({ sortTime: _ignore, ...item }) => item);
  } catch (err) {
    console.warn("Backend offline atau error saat fetch dashboard:", err);
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
