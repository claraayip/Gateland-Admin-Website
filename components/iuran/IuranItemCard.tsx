import { Bell, Eye, Pencil, Shield, Trash2, Users, Wrench, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Switch } from "@/components/ui/Switch";
import { formatRupiah, percentOf } from "@/lib/format";
import type { IuranIcon, IuranPost } from "@/lib/types";
import { cn } from "@/lib/cn";

// Data hanya menyimpan kunci string (bisa diserialisasi); komponen ikon dipetakan di sini.
const postIcons: Record<IuranIcon, LucideIcon> = {
  trash: Trash2,
  shield: Shield,
  users: Users,
  wrench: Wrench,
};

const actionIcons = { edit: Pencil, eye: Eye, bell: Bell } as const;

const accents = {
  indigo: { card: "", iconBox: "bg-blue-50 text-primary", price: "text-primary" },
  rose: { card: "border-rose-200 bg-rose-50/40", iconBox: "bg-rose-100 text-rose-800", price: "text-red-900" },
} as const;

export function IuranItemCard({ post }: { post: IuranPost }) {
  const accent = accents[post.accent];
  const Icon = postIcons[post.icon];
  const progressPercent = post.progress ? percentOf(post.progress.collected, post.progress.target) : 0;

  return (
    <Card className={cn("p-5 sm:p-6", accent.card)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", accent.iconBox)}>
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-bold text-ink">{post.title}</h3>
              {post.badges.map((badge) => (
                <Badge key={badge.label} tone={badge.tone}>
                  {badge.label}
                </Badge>
              ))}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">{post.description}</p>
          </div>
        </div>

        <div className="shrink-0 sm:text-right">
          <p className={cn("text-xl font-bold", accent.price)}>{formatRupiah(post.price)}</p>
          <p className="text-[11px] text-muted">{post.priceUnit}</p>
        </div>
      </div>

      {post.details && (
        <dl className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 lg:grid-cols-4">
          {post.details.map((detail) => (
            <div key={detail.label}>
              <dt className="text-[11px] text-muted">{detail.label}</dt>
              <dd className={cn("mt-0.5 text-[13px] font-semibold", detail.positive ? "text-green-600" : "text-ink")}>
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {post.progress && (
        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-[11px]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-muted">
              Progres Dana Terkumpul:{" "}
              <strong className="text-ink">
                {formatRupiah(post.progress.collected)} / {formatRupiah(post.progress.target)}
              </strong>
            </span>
            <span className="font-semibold text-green-600">
              {progressPercent}% ({post.progress.paidKK} KK)
            </span>
          </div>
          <ProgressBar value={progressPercent} tone="secondary" label={`Progres ${post.title}`} className="my-2" />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-muted">{post.progress.period}</span>
            <span className="font-semibold text-red-600">{post.progress.unpaidNote}</span>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <div className="flex flex-wrap items-center gap-4">
          {post.actions.map((action) => {
            const ActionIcon = actionIcons[action.icon];
            return (
              <button
                key={action.label}
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <ActionIcon className="size-3.5" aria-hidden="true" /> {action.label}
              </button>
            );
          })}
        </div>
        {post.active !== undefined && <Switch label={`Aktifkan ${post.title}`} defaultChecked={post.active} />}
      </div>
    </Card>
  );
}
