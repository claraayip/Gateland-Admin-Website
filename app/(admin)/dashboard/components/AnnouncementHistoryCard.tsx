"use client";

import { useState } from "react";
import { Megaphone, Info, SlidersHorizontal } from "lucide-react";
import { announcements } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

export function AnnouncementHistoryCard() {
  const [activeTab, setActiveTab] = useState("semua");

  const filteredAnnouncements = announcements.filter((item) => {
    if (activeTab === "semua") return true;
    if (activeTab === "aktif") return item.categoryBadge.includes("Aktif") || item.categoryBadge.includes("Tersemat");
    if (activeTab === "kegiatan") return item.category.toLowerCase().includes("kegiatan") || item.category.toLowerCase().includes("agenda");
    if (activeTab === "iuran") return item.category.toLowerCase().includes("iuran") || item.category.toLowerCase().includes("keuangan");
    return true;
  });

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm space-y-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-primary">
            <Megaphone className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-ink">Riwayat Pengumuman Klaster</h3>
            <p className="text-xs text-muted">
              Daftar pengumuman publik yang telah diterbitkan untuk warga klaster GateLand
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "semua", label: `Semua (${announcements.length})` },
          { id: "aktif", label: "Aktif / Tersemat" },
          { id: "kegiatan", label: "Kegiatan" },
          { id: "iuran", label: "Iuran & Fasum" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
              activeTab === tab.id
                ? "bg-primary text-white"
                : "bg-slate-100 text-muted hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-h-[380px] space-y-3 overflow-y-auto pr-1">
        {filteredAnnouncements.length === 0 ? (
          <p className="py-8 text-center text-xs text-muted">Belum ada pengumuman di kategori ini.</p>
        ) : (
          filteredAnnouncements.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-line bg-slate-50/50 p-4 transition-all hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={item.badgeTone}>{item.category}</Badge>
                  <span className="text-[11px] font-medium text-muted">• {item.categoryBadge}</span>
                </div>
                <h4 className="text-sm font-bold text-ink">{item.title}</h4>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted">
                  <span>{item.dateMeta}</span>
                  <span>• {item.targetMeta}</span>
                  <span className="font-semibold text-green-600">• {item.readMeta}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-slate-100"
                >
                  <Info className="size-3.5" /> Detail
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-slate-100"
                >
                  <SlidersHorizontal className="size-3.5" /> Kelola
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}