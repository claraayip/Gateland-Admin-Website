"use client";

import { useState } from "react";
import { ArrowRight, Check, Landmark, ListChecks, QrCode, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { formatRupiah, getInitials } from "@/lib/format";
import type { PaymentChannel, PendingPayment } from "@/lib/types";
import { cn } from "@/lib/cn";

export type Decision = "approved" | "rejected";

interface PaymentVerificationProps {
  payments: PendingPayment[];
  /** false = ringkasan (4 baris, 4 kolom), true = tampilan penuh dengan aksi validasi. */
  detailed: boolean;
  onToggleDetailed: () => void;
  onDecision: (id: string, decision: Decision) => void;
}

type FilterKey = "perlu-tindakan" | "semua" | "lunas" | "tunggakan";

const OVERVIEW_ROWS = 4;

function ProofButton({ channel, resident }: { channel: PaymentChannel; resident: string }) {
  const Icon = channel.startsWith("QRIS") ? QrCode : Landmark;
  return (
    <button
      type="button"
      aria-label={`Pratinjau bukti ${channel} dari ${resident}`}
      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-slate-50"
    >
      <Icon className="size-4 text-primary" aria-hidden="true" />
      <span>{channel}</span>
      <span className="text-[10px] text-muted">Klik pratinjau</span>
    </button>
  );
}

function buildColumns(detailed: boolean, onDecision: PaymentVerificationProps["onDecision"]) {
  const columns: Column<PendingPayment>[] = [
    {
      key: "resident",
      header: "Penghuni & Unit",
      cell: (payment) => (
        <div className="flex items-center gap-3">
          <Avatar initials={getInitials(payment.residentName)} tone={payment.avatarTone} />
          <div className="min-w-0">
            <p className="font-semibold text-ink">{payment.residentName}</p>
            <p className="text-xs text-muted">{payment.unit}</p>
          </div>
        </div>
      ),
    },
    {
      key: "post",
      header: "Pos Iuran",
      cell: (payment) => (
        <Badge tone="indigo" className="max-w-[11rem] text-center leading-tight whitespace-normal">
          {payment.postName}
        </Badge>
      ),
    },
    { key: "amount", header: "Nominal", cell: (payment) => <strong>{formatRupiah(payment.amount)}</strong> },
    {
      key: "proof",
      header: "Kanal & Bukti",
      cell: (payment) => <ProofButton channel={payment.channel} resident={payment.residentName} />,
    },
  ];

  if (!detailed) return columns;

  return [
    ...columns,
    {
      key: "time",
      header: "Waktu Masuk",
      cell: (payment) => <span className="text-xs text-muted">{payment.submittedAgo}</span>,
    },
    {
      key: "actions",
      header: "Aksi Validasi",
      cell: (payment) => (
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => onDecision(payment.id, "approved")}>
            <Check className="size-3.5" aria-hidden="true" /> Setujui
          </Button>
          <Button
            size="sm"
            variant="danger"
            aria-label={`Tolak pembayaran ${payment.residentName}`}
            onClick={() => onDecision(payment.id, "rejected")}
          >
            <X className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];
}

export function PaymentVerification({ payments, detailed, onToggleDetailed, onDecision }: PaymentVerificationProps) {
  const [filter, setFilter] = useState<FilterKey>("perlu-tindakan");

  const tabs: { key: FilterKey; label: string; count?: number }[] = [
    { key: "perlu-tindakan", label: "Perlu Tindakan", count: payments.length },
    { key: "semua", label: "Semua" },
    { key: "lunas", label: "Lunas" },
    { key: "tunggakan", label: "Tunggakan" },
  ];

  const filtered = filter === "perlu-tindakan" ? payments : [];
  const rows = detailed ? filtered : filtered.slice(0, OVERVIEW_ROWS);

  return (
    <Card>
      <div className="flex flex-col gap-4 p-5 sm:p-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {detailed && (
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-100 text-primary">
              <ListChecks className="size-5" aria-hidden="true" />
            </span>
          )}
          <div>
            <h2 className="text-base font-bold text-ink">Verifikasi Pembayaran Iuran</h2>
            <p className="mt-1 text-xs text-muted">
              Konfirmasi bukti transfer masuk dari warga sebelum kuitansi digital diterbitkan
            </p>
          </div>
        </div>

        <div role="group" aria-label="Filter pembayaran" className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              aria-pressed={filter === tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                filter === tab.key ? "bg-primary text-white" : "bg-slate-100 text-muted hover:bg-slate-200",
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="rounded-full bg-rose-light px-1.5 text-[10px] font-bold text-red-800">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <Table
        columns={buildColumns(detailed, onDecision)}
        rows={rows}
        getRowKey={(payment) => payment.id}
        caption="Pembayaran iuran yang menunggu verifikasi"
        emptyMessage={
          filter === "perlu-tindakan" ? "Semua pembayaran sudah diverifikasi." : "Belum ada data untuk filter ini."
        }
      />

      <div className="flex flex-col gap-2 border-t border-line px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span className="text-muted">
          Menampilkan {rows.length} pembayaran yang membutuhkan validasi manual bendahara
        </span>
        {/* Menggantikan toggleDetailedView() dari toggle.js */}
        <button
          type="button"
          onClick={onToggleDetailed}
          aria-expanded={detailed}
          className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-primary hover:underline"
        >
          {detailed ? "Kembali ke Ringkasan" : "Buka Riwayat Lengkap Seluruh Iuran"}
          {!detailed && <ArrowRight className="size-3.5" aria-hidden="true" />}
        </button>
      </div>
    </Card>
  );
}
