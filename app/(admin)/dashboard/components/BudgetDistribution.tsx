"use client";

import { budgetItems } from "@/lib/data";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { BudgetTone } from "@/lib/types";

const barColors: Record<BudgetTone, string> = {
  primary: "bg-[#090580]",
  secondary: "bg-[#46458c]",
  rose: "bg-[#b97a7a]",
};

const dotColors: Record<BudgetTone, string> = {
  primary: "bg-[#090580]",
  secondary: "bg-[#46458c]",
  rose: "bg-[#b97a7a]",
};

const statusBadgeColors: Record<string, string> = {
  green: "text-[#059669] bg-[#e7f8f0]",
  purple: "text-[#4338ca] bg-[#eef2ff]",
  pink: "text-[#be185d] bg-[#fdf2f8]",
};

interface BudgetDistributionProps {
  collected?: number;
  period?: string;
}

export function BudgetDistribution({ collected = 0, period = "November 2026" }: BudgetDistributionProps) {
  const totalShares = budgetItems.reduce((acc, item) => acc + item.share, 0);

  return (
    <section className="rounded-2xl border border-line bg-white p-6 shadow-sm space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-ink">Distribusi &amp; Alokasi Anggaran Bulanan</h2>
        <p className="mt-1 text-xs text-muted">
          Proyeksi penyaluran kas iuran operasional Cluster GateLand per {period}
        </p>
      </div>

      {/* Stacked progress bar */}
      <div
        className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100"
        role="group"
        aria-label="Distribusi anggaran"
      >
        {budgetItems.map((item) => (
          <div
            key={item.id}
            className={cn("h-full transition-[width] duration-500", barColors[item.tone])}
            style={{ width: `${(item.share / totalShares) * 100}%` }}
            title={`${item.name}: ${item.share}%`}
            aria-label={`${item.name} ${item.share} persen`}
          />
        ))}
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {budgetItems.map((item) => {
          const allocatedAmount = Math.round((collected * item.share) / 100);
          return (
            <div key={item.id} className="rounded-xl border border-line bg-slate-50/60 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className={cn("size-2.5 rounded-full shrink-0", dotColors[item.tone])} aria-hidden="true" />
                <span className="text-[11px] font-bold text-muted uppercase tracking-wide">{item.share}% Porsi</span>
              </div>

              <div>
                <p className="text-[13px] font-bold text-ink">{item.name}</p>
                <p className="mt-1 text-xl font-bold text-ink">{formatRupiah(allocatedAmount)}</p>
                <p className="mt-0.5 text-[11px] text-muted">{item.description}</p>
              </div>

              <span
                className={cn(
                  "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                  statusBadgeColors[item.statusTone] ?? "text-slate-700 bg-slate-100",
                )}
              >
                {item.statusLabel}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

