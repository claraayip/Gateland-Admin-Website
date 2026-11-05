"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LaporanActionsProps {
  period: string;
}

export function LaporanActions({ period }: LaporanActionsProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Pos Iuran,Target KK,Target Nominal,Terkumpul,Capaian\n" +
      "Keamanan & Satpam,150 KK,Rp 10.500.000,Rp 9.800.000,93%\n" +
      "Kebersihan & Sampah,150 KK,Rp 7.500.000,Rp 7.125.000,95%\n" +
      "Kas Cadangan & Perawatan,150 KK,Rp 3.000.000,Rp 2.700.000,90%\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Kas_RT04_${period.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handleExportCSV}>
        <Download className="size-4" aria-hidden="true" /> Ekspor CSV
      </Button>
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="size-4" aria-hidden="true" /> Cetak / Unduh PDF
      </Button>
    </div>
  );
}

