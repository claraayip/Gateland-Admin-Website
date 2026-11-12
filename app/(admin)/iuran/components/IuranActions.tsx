"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { downloadExcelFile } from "@/lib/export";
import { formatRupiah } from "@/lib/format";
import type { IuranPost } from "@/lib/types";

interface IuranActionsProps {
  period: string;
  registeredCount: number;
  posts: IuranPost[];
}

export function IuranActions({ period, registeredCount, posts }: IuranActionsProps) {
  const handleDownloadExcel = () => {
    const headers = [
      "No",
      "Nama Pos Iuran",
      "Tarif",
      "Satuan",
      "Sasaran Penghuni",
      "Status",
    ];
    const rows = posts.map((post, idx) => [
      idx + 1,
      post.title,
      formatRupiah(post.price),
      post.priceUnit,
      `${registeredCount} Penghuni Terdaftar`,
      post.badges.map((b) => b.label).join(", "),
    ]);
    downloadExcelFile(
      `Rekap_Iuran_Cluster_GateLand_${period.replace(/\s+/g, "_")}.xls`,
      `Rekap Kelola Iuran Cluster GateLand (${period})`,
      headers,
      rows,
    );
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={handleDownloadExcel}>
        <Download className="size-4" aria-hidden="true" /> Unduh Rekap (Excel)
      </Button>
      <Button variant="outline" onClick={handlePrintPdf}>
        <Printer className="size-4" aria-hidden="true" /> Unduh PDF
      </Button>
    </div>
  );
}

