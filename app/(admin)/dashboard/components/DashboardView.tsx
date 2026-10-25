"use client";

import { useCallback, useState } from "react";
import { CheckCircle2, Receipt, Wallet, TrendingUp } from "lucide-react";
import { ActivityTimeline } from "./ActivityTimeline";
import { AnnouncementHistoryCard } from "./AnnouncementHistoryCard";
import { PaymentVerification, type Decision } from "./PaymentVerification";
import { BudgetAllocation } from "@/components/dashboard/BudgetAllocation";
import type { ActivityItem, BudgetItem, DashboardSummary, PendingPayment } from "@/lib/types";

interface DashboardViewProps {
  summary: DashboardSummary;
  payments: PendingPayment[];
  activities: ActivityItem[];
  budget: BudgetItem[];
  welcomeName: string;
  location: string;
}

export function DashboardView({
  summary,
  payments,
  activities,
  budget,
  welcomeName,
  location,
}: DashboardViewProps) {
  const [isDetailed, setIsDetailed] = useState(false);
  const toggleDetailedView = useCallback(() => setIsDetailed((value) => !value), []);
  const [pending, setPending] = useState(payments);

  const handleDecision = useCallback(
    (id: string, decision: Decision) => {
      setPending((list) => list.filter((payment) => payment.id !== id));
    },
    [],
  );

  return (
    <div className="space-y-6 font-sans">
      {/* ===== Hero Welcome Banner ===== */}
      <section className="rounded-2xl bg-gradient-to-r from-[#060B7E] via-[#08129C] to-[#060B7E] p-7 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-blue-500/15 blur-3xl"
        />

        <div className="relative z-10">
          {/* Pill Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>Sistem Pembukuan Realtime Aktif • Periode {summary.period}</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2.5">
            Selamat Datang Kembali, {welcomeName}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed max-w-3xl">
            Ringkasan operasional dan pembukuan iuran klaster <strong className="text-white font-bold">{location}</strong>. Pantau arus kas masuk, verifikasi konfirmasi warga, dan kelola ketertiban lingkungan secara presisi.
          </p>
        </div>
      </section>

      {/* ===== 3 Stat Cards ===== */}
      <section aria-label="Statistik Utama" className="grid gap-5 md:grid-cols-3">
        {/* Card 1: Total Iuran Terkumpul */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm border-l-4 border-l-[#050C9C] flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  TOTAL IURAN TERKUMPUL
                </p>
                <p className="mt-2 text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
                  Rp7.350.000
                </p>
              </div>
              <div className="size-10 rounded-xl bg-[#EFF2FE] text-[#3B4CA8] flex items-center justify-center">
                <Wallet className="size-5" />
              </div>
            </div>

            {/* Target & Bar */}
            <div className="mt-4 space-y-1.5">
              <p className="text-[11px] font-medium text-slate-500">
                Target Rp 45.000.000
              </p>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-[#050C9C]" style={{ width: "65%" }} />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <TrendingUp className="size-3" />
              {summary.growthLabel}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Sisa Rp2.150.000
            </span>
          </div>
        </div>

        {/* Card 2: Status Pembayaran Lunas */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm border-l-4 border-l-emerald-500 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  STATUS PEMBAYARAN LUNAS
                </p>
                <p className="mt-2 text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
                  {summary.paidUnits} unit
                </p>
              </div>
              <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="size-5" />
              </div>
            </div>

            {/* Dari 72 unit & Bar */}
            <div className="mt-4 space-y-1.5">
              <p className="text-[11px] font-medium text-slate-500">
                Dari {summary.totalUnits} unit berpenghuni
              </p>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: "93%" }} />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2">
            <p className="text-xs font-medium text-slate-500">
              {summary.qrisUnits} bayar via QRIS otomatis
            </p>
          </div>
        </div>

        {/* Card 3: Belum Lunas / Menunggak */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm border-l-4 border-l-rose-500 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  BELUM LUNAS / MENUNGGAK
                </p>
                <p className="mt-2 text-2xl sm:text-[26px] font-extrabold text-rose-600 tracking-tight">
                  {summary.overdueUnits} unit
                </p>
              </div>
              <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Receipt className="size-5" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xs font-medium text-slate-500">Total Nilai Tagihan</span>
            <span className="text-sm font-extrabold text-rose-600">Rp875.000</span>
          </div>
        </div>
      </section>

      {/* ===== Grid Tengah: Verifikasi Pembayaran (Kiri) & Aktivitas Live (Kanan) ===== */}
      <section className="grid items-start gap-6 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px]">
        <PaymentVerification
          payments={pending}
          detailed={isDetailed}
          onToggleDetailed={toggleDetailedView}
          onDecision={handleDecision}
        />
        <ActivityTimeline items={activities} />
      </section>

      {/* ===== Bagian Bawah: Distribusi & Alokasi Anggaran Bulanan ===== */}
      <BudgetAllocation items={budget} period={summary.period} />
    </div>
  );
}
