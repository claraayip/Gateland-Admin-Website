import type { Metadata } from "next";
import { Suspense } from "react";
import { Calendar, ChevronRight, Clock, FileText, HandCoins, History, ShieldCheck, TrendingUp, Wrench } from "lucide-react";
import { IuranItemCard } from "./components/IuranItemCard";
import { IuranActions } from "./components/IuranActions";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { getLiveIuranData } from "@/lib/services/keuangan.service";
import { formatRupiah, percentOf } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Kelola Iuran" };

function Placeholder({ children }: { children: string }) {
  return (
    <p className="rounded-card border border-dashed border-line bg-white p-10 text-center text-sm text-muted">
      {children}
    </p>
  );
}

async function IuranContent() {
  const data = await getLiveIuranData();
  const remaining = Math.max(0, data.periodTarget - data.periodCollected);
  const collectedPercent = data.periodTarget > 0 ? percentOf(data.periodCollected, data.periodTarget) : 0;

  const mandatoryTemplates = data.posts.filter((post) => post.accent === "indigo");
  const monthlyTariff = mandatoryTemplates.reduce((sum, post) => sum + post.price, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={
          <>
            <span>Cluster GateLand</span>
            <ChevronRight className="size-3" aria-hidden="true" />
            <span>Manajemen Iuran &amp; Tagihan Warga</span>
          </>
        }
        title={
          <>
            Kelola Iuran{" "}
            <span className="ml-1 inline-block rounded-full bg-indigo-100 px-3 py-1 align-middle text-xs font-semibold text-primary">
              Cluster GateLand
            </span>
          </>
        }
        actions={
          <>
            <div className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs text-muted">
              <Calendar className="size-4" aria-hidden="true" />
              <span>
                Periode: <strong className="text-ink">{data.period}</strong>
              </span>
              <span className="size-2 rounded-full bg-success" aria-hidden="true" />
            </div>
            <IuranActions
              period={data.period}
              registeredCount={data.registeredResidentsCount}
              posts={data.posts}
            />
          </>
        }
      />

      <section aria-label="Ringkasan iuran" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Target Periode Berjalan"
          value={formatRupiah(data.periodCollected)}
          hint={
            data.hasBills
              ? `dari target total ${formatRupiah(data.periodTarget)}`
              : "Belum ada tagihan diterbitkan pada periode ini"
          }
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
          value={data.hasBills ? `${data.mandatoryPostsCount} Pos Aktif` : "0 Pos Aktif"}
          hint="Kebersihan, Keamanan, Kas Klaster"
          icon={ShieldCheck}
          tone="secondary"
        >
          <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-[11px]">
            <span className="text-muted">Referensi Tarif: {formatRupiah(monthlyTariff)}/Penghuni</span>
            <span className="font-semibold text-muted">{data.registeredResidentsCount} Penghuni Terdaftar</span>
          </div>
        </StatCard>

        <StatCard
          label="Iuran Insidental/Khusus"
          value={`${data.incidentalPostsCount} Pos Berjalan`}
          hint={data.incidentalPostsCount > 0 ? "Tagihan khusus sedang aktif" : "Belum ada pos insidental aktif"}
          icon={Wrench}
          tone="secondary"
        >
          <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-muted">
              <Clock className="size-3.5" aria-hidden="true" /> Periode <strong className="text-ink">{data.period}</strong>
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700">
              {data.incidentalPostsCount > 0 ? "Aktif" : "0% Progres"}
            </span>
          </div>
        </StatCard>
      </section>

      <Tabs
        label="Bagian manajemen iuran"
        items={[
          {
            id: "pos",
            label: (
              <>
                <FileText className="size-4" aria-hidden="true" /> Daftar Pos Iuran &amp; Tarif
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-white">{data.posts.length}</span>
              </>
            ),
            panel: (
              <div className="space-y-5">
                {data.posts.map((post) => (
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
            panel: <Placeholder>Belum ada riwayat periode tagihan yang diterbitkan oleh admin.</Placeholder>,
          },
          {
            id: "khusus",
            label: (
              <>
                <HandCoins className="size-4" aria-hidden="true" /> Iuran Khusus &amp; Sumbangan
              </>
            ),
            panel: <Placeholder>Belum ada pos iuran khusus atau sumbangan yang berjalan.</Placeholder>,
          },
        ]}
      />
    </div>
  );
}

export default function IuranPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Memuat data iuran...</div>}>
      <IuranContent />
    </Suspense>
  );
}
