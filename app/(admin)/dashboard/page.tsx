import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardView } from "./components/DashboardView";
import { activities, currentUser, dashboardSummary, pendingPayments } from "@/lib/data";

export const metadata: Metadata = { title: "Dashboard Admin" };

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Memuat dashboard...</div>}>
      <DashboardView
        summary={dashboardSummary}
        payments={pendingPayments}
        activities={activities}
        welcomeName={currentUser.welcomeName}
        location={currentUser.location}
      />
    </Suspense>
  );
}
