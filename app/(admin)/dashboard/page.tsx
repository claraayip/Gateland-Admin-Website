import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardView } from "./components/DashboardView";
import { getDashboardData } from "@/lib/services/dashboard.service";

export const metadata: Metadata = { title: "Dashboard Admin" };

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Memuat dashboard...</div>}>
      <DashboardView
        summary={data.summary}
        payments={data.payments}
        activities={data.activities}
        welcomeName={data.welcomeName}
        location={data.location}
      />
    </Suspense>
  );
}
