import { CircleCheck, Clock, Megaphone, Send, UserPlus, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { ActivityItem, ActivityKind } from "@/lib/types";

const kindStyles: Record<ActivityKind, { icon: LucideIcon; className: string }> = {
  approved: { icon: CircleCheck, className: "bg-emerald-100 text-success" },
  reminder: { icon: Send, className: "bg-rose-light text-red-700" },
  "new-resident": { icon: UserPlus, className: "bg-indigo-100 text-secondary" },
  announcement: { icon: Megaphone, className: "bg-indigo-100 text-secondary" },
};

export function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-ink">
          <Clock className="size-4 text-muted" aria-hidden="true" /> Aktivitas Terbaru
        </h2>
        <span className="text-xs font-bold text-primary">• Live</span>
      </div>

      <ol className="flex flex-col gap-4">
        {items.map((item) => {
          const { icon: Icon, className } = kindStyles[item.kind];
          return (
            <li key={item.id} className="flex items-start gap-3">
              <span className={`grid size-7 shrink-0 place-items-center rounded-full ${className}`}>
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-ink">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.description}</p>
                <p className="mt-1 text-[11px] text-slate-400">{item.meta}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
