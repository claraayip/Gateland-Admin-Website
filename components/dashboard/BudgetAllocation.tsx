import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatRupiah } from "@/lib/format";
import type { BudgetItem, BudgetTone } from "@/lib/types";
import { cn } from "@/lib/cn";

const segment: Record<BudgetTone, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  rose: "bg-rose",
};

const textTone: Record<BudgetTone, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  rose: "text-ink",
};

export function BudgetAllocation({ items, period }: { items: BudgetItem[]; period: string }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-base font-bold text-ink">Distribusi &amp; Alokasi Anggaran Bulanan</h2>
      <p className="mt-1 mb-5 text-xs text-muted">
        Proyeksi penyaluran kas iuran operasional klaster GateLand per {period}
      </p>

      {/* Bar bersegmen. Lebar tiap segmen = porsi dari data. */}
      <div role="img" aria-label="Porsi alokasi anggaran" className="mb-5 flex h-3 overflow-hidden rounded-md bg-slate-200">
        {items.map((item) => (
          <div key={item.id} className={segment[item.tone]} style={{ width: `${item.share}%` }} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-2 rounded-xl border border-line p-4">
            <div className="flex items-center gap-2">
              <span className={cn("size-2.5 shrink-0 rounded-full", segment[item.tone])} aria-hidden="true" />
              <h3 className="min-w-0 flex-1 text-[13px] font-semibold text-ink">{item.name}</h3>
              <span className={cn("text-[11px] font-bold whitespace-nowrap", item.tone === "rose" ? "text-muted" : textTone[item.tone])}>
                {item.share}% Porsi
              </span>
            </div>
            <p className={cn("text-xl font-bold", textTone[item.tone])}>{formatRupiah(item.amount)}</p>
            <p className="text-xs text-muted">{item.description}</p>
            <Badge tone={item.statusTone} className="w-fit">
              {item.statusLabel}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
