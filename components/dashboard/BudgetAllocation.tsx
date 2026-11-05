import type { BudgetItem } from "@/lib/types";

export function BudgetAllocation({
  period,
}: {
  items: BudgetItem[];
  period: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm font-sans">
      <h2 className="text-base sm:text-lg font-bold text-slate-900">
        Distribusi &amp; Alokasi Anggaran Bulanan
      </h2>
      <p className="mt-0.5 mb-5 text-xs text-slate-500">
        Proyeksi penyaluran kas iuran operasional klaster GateLand per {period}
      </p>

      {/* Progress Bar 3 Segmen */}
      <div
        role="img"
        aria-label="Porsi alokasi anggaran"
        className="mb-5 flex h-3.5 overflow-hidden rounded-md bg-slate-100 gap-1"
      >
        <div className="bg-[#050C9C] rounded-sm" style={{ width: "45%" }} />
        <div className="bg-[#46458C] rounded-sm" style={{ width: "35%" }} />
        <div className="bg-[#C48C7F] rounded-sm" style={{ width: "20%" }} />
      </div>

      {/* 3 Kotak Alokasi */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Box 1 */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#050C9C]">
                <span className="size-2 rounded-full bg-[#050C9C]" />
              </span>
              <span className="text-[11px] font-bold text-slate-700">45% Porsi</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Keamanan &amp; Satpam Pos</h3>
            <p className="mt-1 text-xl font-extrabold text-[#050C9C]">Rp7.000.000</p>
            <p className="mt-1 text-xs text-slate-500">Honor 2 personel, shift siang &amp; malam</p>
          </div>
          <div className="mt-4">
            <span className="inline-flex rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              Terbayar Terjadwal (Tgl 25)
            </span>
          </div>
        </div>

        {/* Box 2 */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#46458C]">
                <span className="size-2 rounded-full bg-[#46458C]" />
              </span>
              <span className="text-[11px] font-bold text-slate-700">35% Porsi</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Kebersihan &amp; Angkut Sampah</h3>
            <p className="mt-1 text-xl font-extrabold text-[#46458C]">Rp6.000.000</p>
            <p className="mt-1 text-xs text-slate-500">Retribusi armada sampah 3x seminggu &amp; taman RT</p>
          </div>
          <div className="mt-4">
            <span className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
              Tercukupi Penuh
            </span>
          </div>
        </div>

        {/* Box 3 */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#C48C7F]">
                <span className="size-2 rounded-full bg-[#C48C7F]" />
              </span>
              <span className="text-[11px] font-bold text-slate-700">20% Porsi</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Dana Sosial &amp; Perawatan</h3>
            <p className="mt-1 text-xl font-extrabold text-slate-900">Rp 2.000.000</p>
            <p className="mt-1 text-xs text-slate-500">Lampu jalan, santunan warga, kas cadangan</p>
          </div>
          <div className="mt-4">
            <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              Masuk Kas Abadi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
