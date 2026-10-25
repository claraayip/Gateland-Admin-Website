"use client";

import { useCallback, useState } from "react";
import { CircleCheck, Receipt, Wallet } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import { ActivityTimeline } from "./ActivityTimeline";
import { AnnouncementHistoryCard } from "./AnnouncementHistoryCard";
import { PaymentVerification, type Decision } from "./PaymentVerification";
import { formatRupiah, percentOf } from "@/lib/format";
import type { ActivityItem, DashboardSummary, PendingPayment } from "@/lib/types";

interface DashboardViewProps {
  summary: DashboardSummary;
  payments: PendingPayment[];
  activities: ActivityItem[];
  welcomeName: string;
  location: string;
}

export function DashboardView({ summary, payments, activities, welcomeName, location }: DashboardViewProps) {
  const [isDetailed, setIsDetailed] = useState(false);
  const toggleDetailedView = useCallback(() => setIsDetailed((value) => !value), []);

  const [pending, setPending] = useState(payments);
  const [notice, setNotice] = useState<string | null>(null);

  const handleDecision = useCallback(
    (id: string, decision: Decision) => {
      const target = pending.find((payment) => payment.id === id);
      if (!target) return;
      setPending((list) => list.filter((payment) => payment.id !== id));
      setNotice(`Pembayaran ${target.residentName} ${decision === "approved" ? "disetujui" : "ditolak"}.`);
    },
    [pending],
  );

  const verification = (
    <PaymentVerification
      payments={pending}
      detailed={isDetailed}
      onToggleDetailed={toggleDetailedView}
      onDecision={handleDecision}
    />
  );

  const liveRegion = (
    <p role="status" aria-live="polite" className={notice ? "mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800" : "sr-only"}>
      {notice}
    </p>
  );

  if (isDetailed) {
    return (
      <div>
        {liveRegion}
        {verification}
      </div>
    );
  }

  const collectedPercent = percentOf(summary.collected, summary.target);
  const paidPercent = percentOf(summary.paidUnits, summary.totalUnits);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-card bg-gradient-to-br from-primary to-secondary px-6 py-7 text-white shadow-[0_4px_12px_rgb(9_5_128/0.15)] sm:px-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-1 text-[11px] font-medium">
          <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          Sistem Pembukuan Realtime Aktif • Periode {summary.period}
        </div>
        <h1 className="mb-2 text-xl font-bold sm:text-[22px]">Selamat Datang Kembali, {welcomeName}</h1>
        <p className="max-w-[900px] text-[13px] leading-relaxed text-slate-200">
          Ringkasan operasional dan pembukuan iuran klaster <strong>{location}</strong>. Pantau arus kas masuk,
          verifikasi konfirmasi warga, dan kelola ketertiban lingkungan secara presisi.
        </p>
      </section>

      {/* Kartu statistik */}
      <section aria-label="Ringkasan" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Iuran Terkumpul" value={formatRupiah(summary.collected)} icon={Wallet}>
          <div className="space-y-1.5">
            <ProgressBar value={collectedPercent} label="Iuran terkumpul" />
            <p className="text-[11px] text-muted">Target {formatRupiah(summary.target)}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
              {summary.growthLabel}
            </span>
            <span className="text-xs text-muted">Sisa {formatRupiah(summary.target - summary.collected)}</span>
          </div>
        </StatCard>

        <StatCard label="Status Pembayaran Lunas" value={`${summary.paidUnits} unit`} icon={CircleCheck} tone="success">
          <div className="space-y-1.5">
            <ProgressBar value={paidPercent} tone="success" label="Unit lunas" />
            <p className="text-[11px] text-muted">Dari {summary.totalUnits} unit berpenghuni</p>
          </div>
          <p className="text-xs text-muted">{summary.qrisUnits} bayar via QRIS otomatis</p>
        </StatCard>

        <StatCard
          label="Belum Lunas / Menunggak"
          value={`${summary.overdueUnits} unit`}
          valueClassName="text-danger"
          icon={Receipt}
          tone="danger"
        >
          <div className="mt-auto flex items-center justify-between">
            <span className="text-xs text-muted">Total Nilai Tagihan</span>
            <span className="text-base font-bold text-danger">{formatRupiah(summary.overdueAmount)}</span>
          </div>
        </StatCard>
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          {liveRegion}
          {verification}
        </div>
        <ActivityTimeline items={activities} />
      </section>

      <AnnouncementHistoryCard />
    </div>
  );
}