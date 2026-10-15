import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { activities, budgetItems, currentUser, dashboardSummary, pendingPayments } from "@/lib/data";

export const metadata: Metadata = { title: "Dashboard" };

// Server Component: data diambil di server, lalu diteruskan ke bagian interaktif.
// Ganti import dari lib/data dengan fetch ke API/database saat backend siap.
export default function DashboardPage() {
  return (
    <DashboardView
      summary={dashboardSummary}
      payments={pendingPayments}
      activities={activities}
      budget={budgetItems}
      welcomeName={currentUser.welcomeName}
      location={currentUser.location}
    />
  );
}
