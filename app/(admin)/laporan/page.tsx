import type { Metadata } from "next";
import { Download, Landmark, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { TransactionLog } from "./components/TransactionLog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import { Table, type Column } from "@/components/ui/Table";
import { allocationBreakdown, laporanSummary, posRealizations, transactions } from "@/lib/data";
import { formatRupiah, percentOf } from "@/lib/format";
import type { PosRealization } from "@/lib/types";

export const metadata: Metadata = { title: "Laporan Keuangan" };

const realizationColumns: Column<PosRealization>[] = [
  { key: "name", header: "Nama Pos Iuran", cell: (p) => <span className="font-semibold text-ink">{p.name}</span> },
  { key: "target", header: "Sasaran KK", cell: (p) => <span className="text-muted">{p.tariffLabel}</span> },
  { key: "targetAmount", header: "Target Nominal", cell: (p) => formatRupiah(p.target) },
  { key: "collected", header: "Total Terkumpul", cell: (p) => <strong>{formatRupiah(p.collected)}</strong> },
  {
    key: "ratio",
    header: "Tingkat Capaian",
    className: "min-w-[180px]",
    cell: (p) => {
      const ratio = percentOf(p.collected, p.target);
      return (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-ink">
            {ratio}% ({p.paidKK} KK)
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
      const unpaid = p.totalKK - p.paidKK;
      return unpaid === 0 ? (
        <span className="text-muted">Rp 0</span>
      ) : (
        <span className="font-semibold text-red-600">
          {formatRupiah(p.target - p.collected)} ({unpaid} KK)
        </span>
      );
    },
  },
  { key: "status", header: "Status Pos", cell: (p) => <Badge tone={p.statusTone}>{p.statusLabel}</Badge> },
];

export default function LaporanPage() {
  const { cashIn, allocations, cashBalance, period } = laporanSummary;
  const listed = allocationBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const others = allocations - listed; // sisa dihitung, bukan angka karangan
  const items = [
    ...allocationBreakdown,
    ...(others > 0
      ? [{ id: "other", name: "Pos lainnya", description: "Total beban di luar tiga pos utama", amount: others }]
      : []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<Badge tone="purple">Pembukuan & Keuangan Kas</Badge>}
        title="Laporan & Rekapitulasi Kas RT 04 / RW 08"
        description="Transparansi rekapitulasi iuran warga, realisasi beban operasional, dan cadangan dana likuiditas klaster secara akuntabel."
        actions={
          <>
            <Badge tone="gray">Periode Buku: {period}</Badge>
            <Button variant="outline">
              <Download className="size-4" aria-hidden="true" /> Export Laporan
            </Button>
            <Button>
              <Plus className="size-4" aria-hidden="true" /> Catat Alokasi & Kas Keluar
            </Button>
          </>
        }
      />

      <section aria-label="Ringkasan kas" className="grid gap-5 md:grid-cols-3">
        <StatCard label="Kas Masuk (Bulan Ini)" value={formatRupiah(cashIn)} icon={TrendingUp} tone="success" />
        <StatCard label="Alokasi & Beban Kas" value={formatRupiah(allocations)} icon={TrendingDown} tone="danger" />
        <StatCard label="Total Kas Tersimpan" value={formatRupiah(cashBalance)} icon={Landmark} inverted />
      </section>

      <Card className="p-5 sm:p-6">
        <h2 className="text-base font-bold text-ink">Distribusi Beban & Alokasi</h2>
        <p className="mt-1 mb-5 text-xs text-muted">
          {period} • Realisasi {formatRupiah(allocations)}
        </p>
        <ul className="grid gap-5 md:grid-cols-2">
          {items.map((item) => {
            const share = percentOf(item.amount, allocations);
            return (
              <li key={item.id} className="space-y-1.5">
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
            Evaluasi pencapaian pungutan kas warga Klaster Gardenia (Total 150 Kepala Keluarga)
          </p>
        </div>
        <Table
          columns={realizationColumns}
          rows={posRealizations}
          getRowKey={(p) => p.id}
          caption="Target vs realisasi per pos iuran"
        />
      </Card>

      <TransactionLog transactions={transactions} />
    </div>
  );
}
