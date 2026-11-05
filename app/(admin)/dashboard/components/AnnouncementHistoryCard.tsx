"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, Info, SlidersHorizontal, Trash2, Edit3, MapPin, Calendar, Clock, User, CheckCircle2 } from "lucide-react";
import { announcements as defaultAnnouncements, type AnnouncementItem } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { deleteAnnouncementAction, updateAnnouncementAction } from "@/app/(admin)/pengumuman/actions";
import { cn } from "@/lib/cn";

interface AnnouncementHistoryCardProps {
  announcements?: AnnouncementItem[];
}

export function AnnouncementHistoryCard({
  announcements = defaultAnnouncements,
}: AnnouncementHistoryCardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("semua");

  // State untuk Modal Detail
  const [selectedDetail, setSelectedDetail] = useState<AnnouncementItem | null>(null);

  // State untuk Modal Kelola (Edit & Hapus)
  const [selectedManage, setSelectedManage] = useState<AnnouncementItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Kegiatan Warga");
  const [editUrgency, setEditUrgency] = useState("biasa");
  const [editLocation, setEditLocation] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const list = announcements ?? [];

  const filteredAnnouncements = list.filter((item) => {
    if (activeTab === "semua") return true;
    if (activeTab === "aktif") {
      return (
        item.categoryBadge.toLowerCase().includes("aktif") ||
        item.categoryBadge.toLowerCase().includes("tersemat") ||
        item.categoryBadge.toLowerCase().includes("baru") ||
        item.categoryBadge.toLowerCase().includes("darurat")
      );
    }
    if (activeTab === "kegiatan") {
      return (
        item.category.toLowerCase().includes("kegiatan") ||
        item.category.toLowerCase().includes("agenda")
      );
    }
    if (activeTab === "iuran") {
      return (
        item.category.toLowerCase().includes("iuran") ||
        item.category.toLowerCase().includes("keuangan")
      );
    }
    return true;
  });

  const handleOpenManage = (item: AnnouncementItem) => {
    setSelectedManage(item);
    setEditTitle(item.title);
    setEditCategory(item.category || "Kegiatan Warga");
    setEditUrgency(item.urgency || "biasa");
    setEditLocation(item.location || "");
    setEditContent(item.content || "");
  };

  const handleUpdate = async () => {
    if (!selectedManage) return;
    const rawId = selectedManage.dbId || selectedManage.id.replace("db-ann-", "");
    setIsSubmitting(true);

    try {
      const res = await updateAnnouncementAction(rawId, {
        title: editTitle,
        category: editCategory,
        urgency: editUrgency,
        location: editLocation,
        content: editContent,
      });

      if (!res.success) {
        alert(res.error || "Gagal memperbarui pengumuman.");
      } else {
        setNotice("Pengumuman berhasil diperbarui.");
        setSelectedManage(null);
        router.refresh();
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedManage) return;
    const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus pengumuman "${selectedManage.title}"? Pengumuman ini akan otomatis hilang dari website dan mobile warga.`);
    if (!confirmDelete) return;

    const rawId = selectedManage.dbId || selectedManage.id.replace("db-ann-", "");
    setIsSubmitting(true);

    try {
      const res = await deleteAnnouncementAction(rawId);

      if (!res.success) {
        alert(res.error || "Gagal menghapus pengumuman.");
      } else {
        setNotice("Pengumuman berhasil dihapus dari sistem.");
        setSelectedManage(null);
        router.refresh();
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-sm space-y-5">
      {notice && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            <span>{notice}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="cursor-pointer font-bold underline"
          >
            Tutup
          </button>
        </div>
      )}

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
          { id: "semua", label: `Semua (${list.length})` },
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
                  onClick={() => setSelectedDetail(item)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-slate-100 transition-colors"
                >
                  <Info className="size-3.5 text-indigo-600" /> Detail
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenManage(item)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-slate-100 transition-colors"
                >
                  <SlidersHorizontal className="size-3.5 text-slate-600" /> Kelola
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ─── MODAL DETAIL PENGUMUMAN ─── */}
      <Modal
        open={selectedDetail !== null}
        onClose={() => setSelectedDetail(null)}
        title="Detail Pengumuman Klaster"
        description="Informasi lengkap pengumuman yang telah disebarkan ke aplikasi mobile warga."
        footer={
          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              onClick={() => setSelectedDetail(null)}
              className="cursor-pointer rounded-lg border border-line bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-slate-50"
            >
              Tutup
            </button>
            {selectedDetail && (
              <button
                type="button"
                onClick={() => {
                  const item = selectedDetail;
                  setSelectedDetail(null);
                  handleOpenManage(item);
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
              >
                <SlidersHorizontal className="size-3.5" /> Kelola / Edit
              </button>
            )}
          </div>
        }
      >
        {selectedDetail && (
          <div className="space-y-4 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={selectedDetail.badgeTone}>{selectedDetail.category}</Badge>
              <span className="font-semibold text-slate-700">• {selectedDetail.categoryBadge}</span>
            </div>

            <h3 className="text-base font-extrabold text-ink">{selectedDetail.title}</h3>

            <div className="rounded-xl border border-line bg-slate-50 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="size-4 text-slate-500" />
                <span>{selectedDetail.dateMeta}</span>
              </div>
              {selectedDetail.location && (
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="size-4 text-slate-500" />
                  <span>Lokasi: <strong>{selectedDetail.location}</strong></span>
                </div>
              )}
              {selectedDetail.eventDate && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="size-4 text-slate-500" />
                  <span>Pelaksanaan: <strong>{selectedDetail.eventDate} {selectedDetail.eventTime ? `(${selectedDetail.eventTime})` : ""}</strong></span>
                </div>
              )}
              {selectedDetail.authorName && (
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="size-4 text-slate-500" />
                  <span>Diterbitkan oleh: <strong>{selectedDetail.authorName}</strong></span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-ink">Isi Pengumuman:</label>
              <div className="rounded-xl border border-line bg-white p-4 text-slate-800 leading-relaxed whitespace-pre-line text-sm">
                {selectedDetail.content || "Tidak ada deskripsi konten tambahan."}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── MODAL KELOLA PENGUMUMAN (EDIT & HAPUS) ─── */}
      <Modal
        open={selectedManage !== null}
        onClose={() => setSelectedManage(null)}
        title="Kelola Pengumuman"
        description="Perbarui isi atau hapus pengumuman ini dari database dan aplikasi mobile."
        footer={
          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleDelete}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="size-3.5" /> Hapus Pengumuman
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedManage(null)}
                className="cursor-pointer rounded-lg border border-line bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleUpdate}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
              >
                <Edit3 className="size-3.5" /> {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-ink mb-1">Judul Pengumuman</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-ink mb-1">Kategori</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-ink focus:border-primary focus:outline-none"
              >
                <option value="Kegiatan Warga">Kegiatan Warga</option>
                <option value="Keamanan">Keamanan</option>
                <option value="Fasilitas">Fasilitas</option>
                <option value="Iuran & Kas">Iuran & Kas</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-ink mb-1">Tingkat Urgensi</label>
              <select
                value={editUrgency}
                onChange={(e) => setEditUrgency(e.target.value)}
                className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-ink focus:border-primary focus:outline-none"
              >
                <option value="biasa">Biasa / Informasi</option>
                <option value="penting">Penting</option>
                <option value="darurat">Darurat / Mendesak</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-ink mb-1">Lokasi (Opsional)</label>
            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              placeholder="Contoh: Balai Warga RT 04"
              className="w-full rounded-xl border border-line px-3.5 py-2.5 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-ink mb-1">Isi / Uraian Pengumuman</label>
            <textarea
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full rounded-xl border border-line p-3 text-xs text-ink focus:border-primary focus:outline-none leading-relaxed"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
