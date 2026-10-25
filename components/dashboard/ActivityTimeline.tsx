import { CheckCircle2, Clock, MessageSquareText, Megaphone, UserPlus } from "lucide-react";
import type { ActivityItem } from "@/lib/types";

export function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm font-sans">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <div className="size-8 rounded-lg bg-indigo-50 text-[#050C9C] flex items-center justify-center">
            <Clock className="size-4" />
          </div>
          <span>Aktivitas Terbaru</span>
        </h2>
        <span className="flex items-center gap-1.5 text-xs font-bold text-[#050C9C]">
          <span className="size-2 rounded-full bg-[#050C9C]" />
          <span>Live</span>
        </span>
      </div>

      {/* List */}
      <ol className="flex flex-col gap-4">
        {items.map((item, index) => {
          let icon = <CheckCircle2 className="size-4 text-emerald-600" />;
          let iconBg = "bg-emerald-50";

          if (item.kind === "reminder") {
            icon = <MessageSquareText className="size-4 text-rose-500" />;
            iconBg = "bg-rose-50";
          } else if (item.kind === "new-resident") {
            icon = <UserPlus className="size-4 text-indigo-600" />;
            iconBg = "bg-indigo-50";
          } else if (item.kind === "announcement") {
            icon = <Megaphone className="size-4 text-indigo-600" />;
            iconBg = "bg-indigo-50";
          }

          return (
            <li key={`${item.id}-${index}`} className="flex items-start gap-3">
              <span className={`grid size-8 shrink-0 place-items-center rounded-full ${iconBg}`}>
                {icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-slate-900">{item.title}</p>
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{item.description}</p>
                <p className="mt-1 text-[11px] text-slate-400">{item.meta}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
