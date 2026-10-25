"use client";

import { useState } from "react";
import { Check, FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { formatRupiah } from "@/lib/format";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/cn";

type Filter = "semua" | "masuk" | "keluar";

const filters: { key: Filter; label: string }[] = [
  { key: "semua", label: "Semua Mutasi" },
  { key: "masuk", label: "Uang Masuk / Iuran" },
  { key: "keluar", label: "Uang Keluar / Beban" },
];

const columns: Column<Transaction>[] = [
  { key: "id", header: "No. Bukti / Kuitansi", cell: (t) => <span className="font-semibold text-ink">{t.id}</span> },
  { key: "date", header: "Tanggal Transaksi", cell: (t) => <span className="text-muted">{t.date}</span> },
  {
    key: "desc",
    header: "Kategori & Uraian",
    cell: (t) => (
      <div>
        <p className="font-semibold text-ink">{t.description}</p>
        <p className="text-xs text-muted">Pos: {t.post}</p>
      </div>
    ),
  },
  { key: "account", header: "Rekening Kas", cell: (t) => <Badge>{t.account}</Badge> },
  {
    key: "amount",
    header: "Nominal (Rp)",
    cell: (t) => (
      <strong className={t.amount >= 0 ? "text-green-600" : "text-red-600"}>
        {t.amount >= 0 ? "+" : "-"}
        {formatRupiah(Math.abs(t.amount))}
      </strong>
    ),
  },
  {
    key: "status",
    header: "Status Verifikasi",
    headerClassName: "text-center",
    className: "text-center",
    cell: (t) => (
      <Badge tone="green">
        <Check className="size-3" aria-hidden="true" /> {t.verification}
      </Badge>
    ),
  },
  {
    key: "proof",
    header: "Bukti / Slip",
    headerClassName: "text-center",
    className: "text-center",
    cell: (t) => (
      <button
        type="button"
        title="Lihat Bukti"
        aria-label={`Lihat bukti ${t.id}`}
        className="cursor-pointer rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-primary"
      >
        <FileText className="size-4" aria-hidden="true" />
      </button>
    ),
  },
];

export function TransactionLog({ transactions }: { transactions: Transaction[] }) {
  const [filter, setFilter] = useState<Filter>("keluar");

  const rows = transactions.filter((t) =>
    filter === "semua" ? true : filter === "masuk" ? t.amount > 0 : t.amount < 0,
  );

  return (
    <Card>
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <h2 className="text-base font-bold text-ink">Log Transaksi Kas & Mutasi Terkini</h2>
        <div role="group" aria-label="Filter mutasi" className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              aria-pressed={filter === item.key}
              onClick={() => setFilter(item.key)}
              className={cn(
                "cursor-pointer rounded-md px-4 py-1.5 text-[11px] font-semibold transition-colors",
                filter === item.key ? "bg-primary text-white" : "bg-indigo-100 text-primary hover:bg-indigo-200",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <Table
        columns={columns}
        rows={rows}
        getRowKey={(t) => t.id}
        caption="Log transaksi kas"
        emptyMessage="Belum ada mutasi untuk filter ini."
      />
    </Card>
  );
}