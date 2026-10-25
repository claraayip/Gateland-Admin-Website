import type { Metadata } from "next";
import { DashboardView } from "./components/DashboardView";
import { activities, currentUser, dashboardSummary, pendingPayments } from "@/lib/data";

export const metadata: Metadata = { title: "Dashboard Admin" };

export default function DashboardPage() {
  return (
    <DashboardView
      summary={dashboardSummary}
      payments={pendingPayments}
      activities={activities}
      welcomeName={currentUser.welcomeName}
      location={currentUser.location}
    />
  );
}