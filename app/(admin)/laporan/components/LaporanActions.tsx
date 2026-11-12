"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { downloadCsvFile } from "@/lib/export";
import { formatRupiah, percentOf } from "@/lib/format";
import type { PosRealization, Transaction } from "@/lib/types";

interface LaporanActionsProps {
  period: string;
  cashIn: number;
  allocations: number;
  cashBalance: number;
  realizations: PosRealization[];
  transactions: Transaction[];
}

export function LaporanActions({
  period,
  cashIn,
  allocations,
  cashBalance,
  realizations,
  transactions,
}: LaporanActionsProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      "Bagian",
      "Keterangan / Pos Iuran",
      "Sasaran / Rekening",
      "Target / Tanggal",
      "Terkumpul / Nominal",
      "Capaian / Status",
    ];

    const rows: (string | number)[][] = [
      ["Ringkasan Kas", "Kas Masuk (Bulan Ini)", "Cluster GateLand", period, formatRupiah(cashIn), "Aktif"],
      ["Ringkasan Kas", "Alokasi & Beban Kas", "Cluster GateLand", period, formatRupiah(allocations), "Aktif"],
      ["Ringkasan Kas", "Total Kas Tersimpan", "Cluster GateLand", period, formatRupiah(cashBalance), "Saldo"],
      ...realizations.map((r) => [
        "Realisasi Pos Iuran",
        r.name,
        r.tariffLabel,
        formatRupiah(r.target),
        formatRupiah(r.collected),
        `${r.target > 0 ? percentOf(r.collected, r.target) : 0}% (${r.statusLabel})`,
      ]),
      ...transactions.map((t) => [
        "Log Transaksi Kas",
        `${t.id} - ${t.description}`,
        t.account,
        t.date,
        t.amount >= 0 ? `+${formatRupiah(t.amount)}` : `-${formatRupiah(Math.abs(t.amount))}`,
        t.verification,
      ]),
    ];

    downloadCsvFile(
      `Laporan_Kas_GateLand_${period.replace(/\s+/g, "_")}.csv`,
      headers,
      rows,
    );
  };

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={handleExportCSV}>
        <Download className="size-4" aria-hidden="true" /> Ekspor CSV
      </Button>
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="size-4" aria-hidden="true" /> Cetak / Unduh PDF
      </Button>
    </div>
  );
}
