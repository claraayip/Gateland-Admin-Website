import type { Metadata } from "next";
import { Suspense } from "react";
import { Landmark, TrendingDown, TrendingUp } from "lucide-react";
import { TransactionLog } from "./components/TransactionLog";
import { LaporanActions } from "./components/LaporanActions";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import { Table, type Column } from "@/components/ui/Table";
import { getLiveLaporanData } from "@/lib/services/keuangan.service";
import { formatRupiah, percentOf } from "@/lib/format";
import type { PosRealization } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Laporan Keuangan" };

const realizationColumns: Column<PosRealization>[] = [
  { key: "name", header: "Nama Pos Iuran", cell: (p) => <span className="font-semibold text-ink">{p.name}</span> },
  { key: "target", header: "Sasaran Penghuni", cell: (p) => <span className="text-muted">{p.tariffLabel}</span> },
  { key: "targetAmount", header: "Target Nominal", cell: (p) => formatRupiah(p.target) },
  { key: "collected", header: "Total Terkumpul", cell: (p) => <strong>{formatRupiah(p.collected)}</strong> },
  {
    key: "ratio",
    header: "Tingkat Capaian",
    className: "min-w-[180px]",
    cell: (p) => {
      const ratio = p.target > 0 ? percentOf(p.collected, p.target) : 0;
      return (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-ink">
            {ratio}% ({p.paidKK} Penghuni)
          </p>
          <ProgressBar value={ratio} tone={ratio >= 100 ? "success" : "primary"} label={`Capaian ${p.name}`} />
        </div>
      );
    },
  },
  {
    key: "arrears",
    header: "Sisa Tunggakan",
    cell: (p) => {
      const unpaid = Math.max(0, p.totalKK - p.paidKK);
      const diff = Math.max(0, p.target - p.collected);
      return diff === 0 ? (
        <span className="text-muted">Rp 0</span>
      ) : (
        <span className="font-semibold text-red-600">
          {formatRupiah(diff)} ({unpaid} Penghuni)
        </span>
      );
    },
  },
  { key: "status", header: "Status Pos", cell: (p) => <Badge tone={p.statusTone}>{p.statusLabel}</Badge> },
];

async function LaporanContent() {
  const data = await getLiveLaporanData();
  const { cashIn, allocations, cashBalance, period, registeredResidentsCount, allocationItems, realizations, transactions } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<Badge tone="purple">Pembukuan &amp; Keuangan Kas</Badge>}
        title="Laporan & Rekapitulasi Kas Cluster GateLand"
        description="Transparansi rekapitulasi iuran warga, realisasi beban operasional, dan cadangan dana kas Cluster GateLand."
        actions={
          <>
            <Badge tone="gray">Periode Buku: {period}</Badge>
            <LaporanActions
              period={period}
              cashIn={cashIn}
              allocations={allocations}
              cashBalance={cashBalance}
              realizations={realizations}
              transactions={transactions}
            />
          </>
        }
      />

      <section aria-label="Ringkasan kas" className="grid gap-5 md:grid-cols-3">
        <StatCard
          label="Kas Masuk (Bulan Ini)"
          value={formatRupiah(cashIn)}
          hint={cashIn === 0 ? "Belum ada kas masuk" : "Dari pembayaran warga lunas"}
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label="Alokasi & Beban Kas"
          value={formatRupiah(allocations)}
          hint={allocations === 0 ? "Belum ada beban kas keluar" : "Total beban operasional"}
          icon={TrendingDown}
          tone="danger"
        />
        <StatCard
          label="Total Kas Tersimpan"
          value={formatRupiah(cashBalance)}
          hint={`Saldo bersih kas • ${period}`}
          icon={Landmark}
          inverted
        />
      </section>

      <Card className="p-5 sm:p-6">
        <h2 className="text-base font-bold text-ink">Distribusi Beban &amp; Alokasi</h2>
        <p className="mt-1 mb-5 text-xs text-muted">
          {period} • Realisasi {formatRupiah(allocations)} (Belum ada alokasi keluar; 1 contoh format ditampilkan di bawah)
        </p>
        <ul className="grid gap-5 md:grid-cols-2">
          {allocationItems.map((item) => {
            const share = allocations > 0 ? percentOf(item.amount, allocations) : 0;
            return (
              <li key={item.id} className="space-y-1.5 rounded-xl border border-dashed border-line bg-slate-50/60 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[13px] font-semibold text-ink">{item.name}</p>
                  <p className="text-[13px] font-bold text-primary">{formatRupiah(item.amount)}</p>
                </div>
                <p className="text-xs text-muted">{item.description}</p>
                <div className="flex items-center gap-3">
                  <ProgressBar value={share} tone="secondary" label={item.name} />
                  <span className="w-12 shrink-0 text-right text-[11px] font-semibold text-muted">{share}%</span>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <div className="p-5 sm:p-6">
          <h2 className="text-base font-bold text-ink">Rekapitulasi Target vs Realisasi per Pos Iuran</h2>
          <p className="mt-1 text-xs text-muted">
            Evaluasi pencapaian pungutan kas warga Cluster GateLand ({registeredResidentsCount} Penghuni Terdaftar)
          </p>
        </div>
        <Table
          columns={realizationColumns}
          rows={realizations}
          getRowKey={(p) => p.id}
          caption="Target vs realisasi per pos iuran"
        />
      </Card>

      <TransactionLog transactions={transactions} />
    </div>
  );
}

export default function LaporanPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Memuat laporan keuangan...</div>}>
      <LaporanContent />
    </Suspense>
  );
}
