"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Eye, Pencil, Shield, Trash2, Users, Wrench, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Switch } from "@/components/ui/Switch";
import { formatRupiah, percentOf } from "@/lib/format";
import type { IuranIcon, IuranPost } from "@/lib/types";
import { cn } from "@/lib/cn";
import { updateIuranTarifAction } from "../actions";

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
  const router = useRouter();
  const [item, setItem] = useState<IuranPost>(post);
  const [prevProp, setPrevProp] = useState<IuranPost>(post);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [titleInput, setTitleInput] = useState(post.title);
  const [descInput, setDescInput] = useState(post.description);
  const [priceInput, setPriceInput] = useState(String(post.price));
  const [unitInput, setUnitInput] = useState(post.priceUnit);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (post !== prevProp) {
    setPrevProp(post);
    setItem(post);
    setTitleInput(post.title);
    setDescInput(post.description);
    setPriceInput(String(post.price));
    setUnitInput(post.priceUnit);
  }

  const accent = accents[item.accent];
  const Icon = postIcons[item.icon];
  const progressPercent = item.progress ? percentOf(item.progress.collected, item.progress.target) : 0;

  async function handleSaveTarif(e: React.FormEvent) {
    e.preventDefault();
    const numericPrice = Number(priceInput.replace(/\D/g, "")) || 0;
    setSaving(true);
    setErrorMsg(null);

    const res = await updateIuranTarifAction({
      id: item.id,
      title: titleInput,
      description: descInput,
      price: numericPrice,
      priceUnit: unitInput,
      active: item.active,
    });

    setSaving(false);

    if (!res.success) {
      setErrorMsg(res.error || "Gagal memperbarui tarif.");
      return;
    }

    setItem((prev) => ({
      ...prev,
      title: titleInput.trim(),
      description: descInput.trim(),
      price: numericPrice,
      priceUnit: unitInput.trim() || prev.priceUnit,
    }));
    setEditOpen(false);
    router.refresh();
  }

  function openEditModal() {
    setTitleInput(item.title);
    setDescInput(item.description);
    setPriceInput(String(item.price));
    setUnitInput(item.priceUnit);
    setErrorMsg(null);
    setEditOpen(true);
  }

  return (
    <>
      <Card className={cn("p-5 sm:p-6", accent.card)}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", accent.iconBox)}>
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[15px] font-bold text-ink">{item.title}</h3>
                {item.badges.map((badge) => (
                  <Badge key={badge.label} tone={badge.tone}>
                    {badge.label}
                  </Badge>
                ))}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted">{item.description}</p>
            </div>
          </div>

          <div className="shrink-0 sm:text-right">
            <p className={cn("text-xl font-bold", accent.price)}>{formatRupiah(item.price)}</p>
            <p className="text-[11px] text-muted">{item.priceUnit}</p>
          </div>
        </div>

        {item.details && (
          <dl className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 lg:grid-cols-4">
            {item.details.map((detail) => (
              <div key={detail.label}>
                <dt className="text-[11px] text-muted">{detail.label}</dt>
                <dd className={cn("mt-0.5 text-[13px] font-semibold", detail.positive ? "text-green-600" : "text-ink")}>
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {item.progress && (
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-[11px]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-muted">
                Progres Dana Terkumpul:{" "}
                <strong className="text-ink">
                  {formatRupiah(item.progress.collected)} / {formatRupiah(item.progress.target)}
                </strong>
              </span>
              <span className="font-semibold text-green-600">
                {progressPercent}% ({item.progress.paidKK} Penghuni)
              </span>
            </div>
            <ProgressBar value={progressPercent} tone="secondary" label={`Progres ${item.title}`} className="my-2" />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-muted">{item.progress.period}</span>
              <span className="font-semibold text-red-600">{item.progress.unpaidNote}</span>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <div className="flex flex-wrap items-center gap-4">
            {item.actions.map((action) => {
              const ActionIcon = actionIcons[action.icon];
              const handleClick =
                action.icon === "edit"
                  ? openEditModal
                  : action.icon === "eye"
                    ? () => setDetailOpen(true)
                    : () => setDetailOpen(true);
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={handleClick}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <ActionIcon className="size-3.5" aria-hidden="true" /> {action.label}
                </button>
              );
            })}
          </div>
          {item.active !== undefined && <Switch label={`Aktifkan ${item.title}`} defaultChecked={item.active} />}
        </div>
      </Card>

      {/* Modal Edit Tarif */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        size="md"
        title="Edit Tarif Pos Iuran"
        description="Perbarui nama, deskripsi, dan besaran tarif pos iuran Cluster GateLand."
        icon={<Pencil className="size-5" aria-hidden="true" />}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>
              Batal
            </Button>
            <Button type="submit" form={`edit-tarif-${item.id}`} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </>
        }
      >
        <form id={`edit-tarif-${item.id}`} onSubmit={handleSaveTarif} className="space-y-4">
          {errorMsg && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">{errorMsg}</p>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink">Nama Pos Iuran</label>
            <input
              type="text"
              required
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="w-full rounded-xl border border-line bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">Nominal Tarif (Rp)</label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl border border-line bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-primary focus:bg-white focus:outline-none"
              />
              <p className="text-[11px] text-muted">Pratinjau: {formatRupiah(Number(priceInput) || 0)}</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink">Satuan Periode</label>
              <input
                type="text"
                value={unitInput}
                onChange={(e) => setUnitInput(e.target.value)}
                className="w-full rounded-xl border border-line bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-primary focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink">Deskripsi / Uraian</label>
            <textarea
              rows={3}
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              className="w-full rounded-xl border border-line bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-ink focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>
        </form>
      </Modal>

      {/* Modal Rincian Pos Iuran */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        size="md"
        title={item.title}
        description={item.description}
        icon={<Icon className="size-5" aria-hidden="true" />}
        footer={<Button onClick={() => setDetailOpen(false)}>Tutup</Button>}
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <span className="text-muted">Tarif Berlaku</span>
            <span className="text-base font-bold text-primary">
              {formatRupiah(item.price)} <span className="text-xs font-normal text-muted">{item.priceUnit}</span>
            </span>
          </div>
          {item.details && (
            <dl className="grid grid-cols-2 gap-3 rounded-xl border border-line p-4">
              {item.details.map((d) => (
                <div key={d.label}>
                  <dt className="text-muted">{d.label}</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{d.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </Modal>
    </>
  );
}
