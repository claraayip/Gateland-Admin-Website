import type { Metadata } from "next";
import { PenghuniView } from "./components/PenghuniView";
import { dashboardSummary, residentTotals, residents, unitOptions } from "@/lib/data";

export const metadata: Metadata = { title: "Manajemen Data Penghuni" };

export default function PenghuniPage() {
  return (
    <PenghuniView
      initialResidents={residents}
      totalAll={residentTotals.all}
      unitOptions={unitOptions}
      period={dashboardSummary.period}
    />
  );
}
