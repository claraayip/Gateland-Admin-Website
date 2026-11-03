import { apiFetch } from "@/lib/api";
import { activities, currentUser, dashboardSummary, pendingPayments } from "@/lib/data";
import type { ActivityItem, DashboardSummary, PendingPayment } from "@/lib/types";

export interface DashboardRealtimeData {
  summary: DashboardSummary;
  payments: PendingPayment[];
  activities: ActivityItem[];
  welcomeName: string;
  location: string;
}

export async function getDashboardData(): Promise<DashboardRealtimeData> {
  let summary = { ...dashboardSummary };
  let liveActivities = [...activities];
  let liveWelcome = currentUser.welcomeName;
  let liveLocation = currentUser.location;

  try {
    // 1. Ambil data profil admin aktif dari backend
    const meRes = await apiFetch<any>("/api/auth/me");
    if (meRes.data) {
      liveWelcome = meRes.data.name || currentUser.welcomeName;
    }

    // 2. Ambil data statistik riil dari backend (/api/stats)
    const statsRes = await apiFetch<any>("/api/stats");
    if (statsRes.data) {
      const stats = statsRes.data;
      if (stats.users?.total !== undefined) {
        summary.totalUnits = Math.max(stats.users.total, summary.totalUnits);
      }

      // Gabungkan log akses gerbang terbaru dari backend ke aktivitas live dashboard
      if (Array.isArray(stats.accessLogs?.recent) && stats.accessLogs.recent.length > 0) {
        const backendActivities: ActivityItem[] = stats.accessLogs.recent.map((log: any) => ({
          id: `log-${log.id}`,
          kind: log.action === "OPEN" ? "approved" : "reminder",
          title: `Akses Gerbang ${log.gate?.name || "Utama"} (${log.action})`,
          description: `Pengguna ${log.user?.name || "Warga"} mengakses gerbang.`,
          meta: new Date(log.timestamp).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB • Sistem GateLand",
        }));

        liveActivities = [...backendActivities, ...activities].slice(0, 5);
      }
    }
  } catch (err) {
    console.warn("Backend offline atau error saat fetch dashboard, menggunakan data cache:", err);
  }

  return {
    summary,
    payments: pendingPayments,
    activities: liveActivities,
    welcomeName: liveWelcome,
    location: liveLocation,
  };
}

