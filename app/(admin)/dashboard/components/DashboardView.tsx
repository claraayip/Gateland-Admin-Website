"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ClipboardList, TrendingUp, Wallet } from "lucide-react";
import { ActivityTimeline } from "./ActivityTimeline";
import { AnnouncementHistoryCard } from "./AnnouncementHistoryCard";
import { PaymentVerification, type Decision } from "./PaymentVerification";
import { BudgetDistribution } from "./BudgetDistribution";
import { formatRupiah, percentOf } from "@/lib/format";
import type { ActivityItem, DashboardSummary, PendingPayment } from "@/lib/types";
import type { AnnouncementItem } from "@/lib/data";
import { verifyPaymentAction } from "../actions";

interface DashboardViewProps {
  summary: DashboardSummary;
  payments: PendingPayment[];
  activities: ActivityItem[];
  announcements?: AnnouncementItem[];
  welcomeName: string;
  location: string;
}

export function DashboardView({ summary, payments, activities, announcements, welcomeName, location }: DashboardViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Gunakan URL query param `?view=riwayat` agar browser back button dan klik sidebar/dashboard bekerja naturally!
  const isDetailed = searchParams.get("view") === "riwayat";

  const toggleDetailedView = useCallback(() => {
    if (isDetailed) {
      router.push("/dashboard");
    } else {
      router.push("/dashboard?view=riwayat");
    }
  }, [isDetailed, router]);

  const [pending, setPending] = useState(payments);
  const [prevPayments, setPrevPayments] = useState(payments);
  const [notice, setNotice] = useState<string | null>(null);

  if (payments !== prevPayments) {
    setPrevPayments(payments);
    setPending(payments);
  }

  // Real-time polling setiap 12 detik agar data pembayaran dan pengumuman tetap sinkron
  useEffect(() => {
    const timer = setInterval(() => {
      router.refresh();
    }, 12000);
    return () => clearInterval(timer);
  }, [router]);

  const handleDecision = useCallback(
    async (id: string, decision: Decision) => {
      const target = pending.find((payment) => payment.id === id);
      if (!target) return;
      setPending((list) => list.filter((payment) => payment.id !== id));
      setNotice(`Pembayaran ${target.residentName} ${decision === "approved" ? "disetujui" : "ditolak"}.`);
      
      try {
        await verifyPaymentAction(id, decision);
      } catch (err) {
        console.error("Gagal verifikasi pembayaran ke server:", err);
      }
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

  const collectedPercent = summary.target > 0 ? percentOf(summary.collected, summary.target) : 0;
  const remainingTarget = Math.max(0, summary.target - summary.collected);
  const paidPercent = summary.totalUnits > 0 ? percentOf(summary.paidUnits, summary.totalUnits) : 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-r from-[#0d096b] via-[#100a78] to-[#3a3782] px-7 py-7 text-white shadow-sm sm:px-9">
        <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-[26px]">Selamat Datang Kembali, {welcomeName}</h1>
        <p className="max-w-[950px] text-xs leading-relaxed text-slate-200">
          Ringkasan operasional pengelola <strong>{location}</strong> periode <strong>{summary.period}</strong>. Pantau
          penghuni terdaftar, status tagihan &amp; konfirmasi pembayaran warga, serta informasi lingkungan secara terpadu.
        </p>
      </section>

      {/* Kartu statistik - 3 Kolom sesuai Desain UI/UX */}
      <section aria-label="Ringkasan Statistik" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {/* Card 1: TOTAL IURAN TERKUMPUL */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          {/* Garis aksen vertikal kiri warna biru navy */}
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#090580]" aria-hidden="true" />
          
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  TOTAL IURAN
                </p>
                <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  TERKUMPUL
                </p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#e8e9fc] text-[#090580]">
                <Wallet className="size-5" />
              </div>
            </div>

            <p className="mt-3 text-[28px] font-extrabold tracking-tight text-slate-900">
              {formatRupiah(summary.collected)}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-slate-600">
                {summary.target > 0
                  ? `Target ${formatRupiah(summary.target)}`
                  : "Belum ada tagihan dikelola admin"}
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#090580] transition-all duration-500"
                  style={{ width: `${collectedPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f8f0] px-2.5 py-1 text-[11px] font-semibold text-[#059669]">
                <TrendingUp className="size-3" />
                <span>{summary.growthLabel}</span>
              </span>
              <span className="text-xs font-medium text-slate-500">
                Sisa {formatRupiah(remainingTarget)}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: STATUS PEMBAYARAN LUNAS */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          {/* Garis aksen vertikal kiri warna hijau tua */}
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#15803d]" aria-hidden="true" />

          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  STATUS
                </p>
                <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  PEMBAYARAN
                </p>
                <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  LUNAS
                </p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#e3f4e9] text-[#15803d]">
                <div className="flex size-5 items-center justify-center rounded-full bg-[#15803d] text-white">
                  <Check className="size-3.5 stroke-[3]" />
                </div>
              </div>
            </div>

            <p className="mt-3 text-[28px] font-extrabold tracking-tight text-slate-900">
              {summary.paidUnits} penghuni
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-slate-600">
                Dari {summary.totalUnits} penghuni terdaftar
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#15803d] transition-all duration-500"
                  style={{ width: `${paidPercent}%` }}
                />
              </div>
            </div>

            <p className="pt-1 text-xs font-medium text-slate-500">
              {summary.qrisUnits} bayar via QRIS otomatis
            </p>
          </div>
        </div>

        {/* Card 3: BELUM LUNAS / MENUNGGAK */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          {/* Garis aksen vertikal kiri warna merah marun */}
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#b91c1c]" aria-hidden="true" />

          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  BELUM LUNAS /
                </p>
                <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  MENUNGGAK
                </p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#fee2e2] text-[#b91c1c]">
                <ClipboardList className="size-5" />
              </div>
            </div>

            <p className="mt-3 text-[28px] font-extrabold tracking-tight text-[#b91c1c]">
              {summary.overdueUnits} penghuni
            </p>
          </div>

          <div className="mt-auto pt-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Nilai Tagihan</span>
              <span className="text-sm font-bold text-[#b91c1c]">
                {formatRupiah(summary.overdueAmount)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabel Verifikasi & Aktivitas */}
      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          {liveRegion}
          {verification}
        </div>
        <ActivityTimeline items={activities} />
      </section>

      {/* Riwayat Pengumuman Klaster */}
      <AnnouncementHistoryCard announcements={announcements} />

      {/* Distribusi & Alokasi Anggaran Bulanan */}
      <BudgetDistribution collected={summary.collected} period={summary.period} />
    </div>
  );
}
