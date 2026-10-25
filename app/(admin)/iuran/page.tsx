import type { Metadata } from "next";
import { Calendar, ChevronRight, Clock, Download, FileText, HandCoins, History, ShieldCheck, TrendingUp, Wrench } from "lucide-react";
import { IuranItemCard } from "./components/IuranItemCard";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { dashboardSummary, iuranPosts, iuranSummary } from "@/lib/data";
import { formatRupiah, percentOf } from "@/lib/format";

export const metadata: Metadata = { title: "Kelola Iuran" };

function Placeholder({ children }: { children: string }) {
  return (
    <p className="rounded-card border border-dashed border-line bg-white p-10 text-center text-sm text-muted">
      {children}
    </p>
  );
}

export default function IuranPage() {
  const remaining = iuranSummary.periodTarget - iuranSummary.periodCollected;
  const collectedPercent = percentOf(iuranSummary.periodCollected, iuranSummary.periodTarget);

  const mandatory = iuranPosts.filter((post) => post.accent === "indigo");
  const monthlyTariff = mandatory.reduce((sum, post) => sum + post.price, 0);
  const special = iuranPosts.find((post) => post.progress);
  const specialPercent = special?.progress ? Math.round(percentOf(special.progress.collected, special.progress.target)) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={
          <>
            <span>Klaster Gardenia & Boulevard</span>
            <ChevronRight className="size-3" aria-hidden="true" />
            <span>Manajemen Iuran & Tagihan Warga</span>
          </>
        }
        title={
          <>
            Kelola & Master Pos Iuran{" "}
            <span className="ml-1 inline-block rounded-full bg-indigo-100 px-3 py-1 align-middle text-xs font-semibold text-primary">
              RT 04 / RW 08
            </span>
          </>
        }
        actions={
          <>
            <div className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs text-muted">
              <Calendar className="size-4" aria-hidden="true" />
              <span>
                Periode: <strong className="text-ink">{dashboardSummary.period}</strong>
              </span>
              <span className="size-2 rounded-full bg-success" aria-hidden="true" />
            </div>
            <Button variant="outline">
              <Download className="size-4" aria-hidden="true" /> Unduh Rekap (Excel/PDF)
            </Button>
          </>
        }
      />

      <section aria-label="Ringkasan iuran" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Target Periode Berjalan"
          value={formatRupiah(iuranSummary.periodCollected)}
          hint={`dari target total ${formatRupiah(iuranSummary.periodTarget)}`}
          icon={HandCoins}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1 text-green-600">
                <TrendingUp className="size-3.5" aria-hidden="true" /> {collectedPercent}% Terkumpul
              </span>
              <span className="text-muted">Sisa {formatRupiah(remaining)}</span>
            </div>
            <ProgressBar value={collectedPercent} label="Iuran periode berjalan" />
          </div>
        </StatCard>

        <StatCard
          label="Iuran Rutin Wajib"
          value={`${mandatory.length} Pos Utama`}
          hint="Kebersihan, Keamanan, Kas RT"
          icon={ShieldCheck}
          tone="secondary"
        >
          <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-[11px]">
            <span className="text-muted">Total Tarif: {formatRupiah(monthlyTariff)}/KK</span>
            <span className="font-semibold text-muted">{iuranSummary.totalKK} KK Wajib</span>
          </div>
        </StatCard>

        {special && (
          <StatCard
            label="Iuran Insidental/Khusus"
            value="1 Pos Berjalan"
            hint={special.title}
            icon={Wrench}
            tone="secondary"
          >
            <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-muted">
                <Clock className="size-3.5" aria-hidden="true" /> Jatuh Tempo <strong className="text-ink">25 Okt</strong>
              </span>
              <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-800">
                {specialPercent}% Progres
              </span>
            </div>
          </StatCard>
        )}
      </section>

      <Tabs
        label="Bagian manajemen iuran"
        items={[
          {
            id: "pos",
            label: (
              <>
                <FileText className="size-4" aria-hidden="true" /> Daftar Pos Iuran & Master Tarif
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-white">{iuranPosts.length}</span>
              </>
            ),
            panel: (
              <div className="space-y-5">
                {iuranPosts.map((post) => (
                  <IuranItemCard key={post.id} post={post} />
                ))}
              </div>
            ),
          },
          {
            id: "riwayat",
            label: (
              <>
                <History className="size-4" aria-hidden="true" /> Riwayat Periode Tagihan
              </>
            ),
            panel: <Placeholder>Riwayat periode tagihan belum dimigrasikan.</Placeholder>,
          },
          {
            id: "khusus",
            label: (
              <>
                <HandCoins className="size-4" aria-hidden="true" /> Iuran Khusus & Sumbangan
              </>
            ),
            panel: <Placeholder>Daftar iuran khusus & sumbangan belum dimigrasikan.</Placeholder>,
          },
        ]}
      />
    </div>
  );
}
