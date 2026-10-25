import type { Metadata } from "next";
import { DashboardView } from "./components/DashboardView";
import { activities, budgetItems, currentUser, dashboardSummary, pendingPayments } from "@/lib/data";

export const metadata: Metadata = { title: "Dashboard" };

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
