import type { Metadata } from "next";
import { Suspense } from "react";
import { PenghuniView } from "./components/PenghuniView";
import { getPenghuniData } from "@/lib/services/penghuni.service";
import { dashboardSummary, unitOptions } from "@/lib/data";

export const metadata: Metadata = { title: "Manajemen Data Penghuni" };

export default async function PenghuniPage() {
  const data = await getPenghuniData();

  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Memuat data penghuni...</div>}>
      <PenghuniView
        initialResidents={data.residents}
        totalAll={data.totalAll}
        unitOptions={unitOptions}
        period={dashboardSummary.period}
      />
    </Suspense>
  );
}
