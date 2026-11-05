"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clock,
  Megaphone,
  Radio,
  Save,
  Users,
  Wrench,
  Shield,
  CreditCard,
  HelpCircle,
  MapPin,
  XCircle,
} from "lucide-react";
import { createAnnouncementAction } from "@/app/(admin)/pengumuman/buat/action";
import { cn } from "@/lib/cn";

const TITLE_LIMIT = 120;

export function BuatPengumumanForm() {
  const [state, formAction, isPending] = useActionState(createAnnouncementAction, {});
  
  // States form
  const [title, setTitle] = useState("");
  const [kategori, setKategori] = useState("kegiatan");
  const [urgensi, setUrgensi] = useState("biasa");
  const [isi, setIsi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jam, setJam] = useState("");
  const [targetWarga, setTargetWarga] = useState("seluruh");

  return (
    <form action={formAction} className="mx-auto max-w-[1000px] space-y-6 pb-12">
      {state?.message && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
          {state.message}
        </div>
      )}

      {/* Header bar atas: Breadcrumb & Tombol Aksi Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/dashboard" className="flex items-center gap-1 hover:text-slate-900">
              <span className="grid size-4 place-items-center">⊞</span> Dashboard
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="hover:text-slate-900 cursor-pointer">Pengumuman &amp; Warga</span>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="font-semibold text-slate-900">Buat Pengumuman Baru</span>
          </nav>

          {/* Action pills di bawah breadcrumb */}
          <div className="mt-2.5 flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              <ArrowLeft className="size-3.5" />
              Kembali ke Dashboard
            </Link>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-primary">
              <span className="size-2 rounded-full bg-primary" />
              Mode Editor Aktif
            </span>
          </div>
        </div>

        {/* Draf status & tombol simpan draf */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-right text-xs text-slate-500">
            <span className="text-slate-400 text-sm">☁</span>
            <div className="leading-tight">
              <p className="text-[11px] text-slate-400">Draf tersimpan otomatis:</p>
              <p className="font-semibold text-slate-700">10:42 WIB</p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            <Save className="size-4 text-slate-500" />
            Simpan Draf
          </button>
        </div>
      </div>

      {/* KARTU 1: Detail Pengumuman */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8 space-y-6">
        {/* Header Seksi */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-primary">
            <Megaphone className="size-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Detail Pengumuman</h2>
        </div>

        {/* Judul Pengumuman */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="judul" className="font-bold text-slate-800">
              Judul Pengumuman <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {title.length} / {TITLE_LIMIT} karakter
            </span>
          </div>
          <input
            id="judul"
            name="judul"
            type="text"
            required
            maxLength={TITLE_LIMIT}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-[11px] text-slate-400">
            Buat judul singkat, jelas, dan memuat tujuan utama pesan.
          </p>
          {state?.errors?.judul && (
            <p className="text-xs font-semibold text-red-500">{state.errors.judul[0]}</p>
          )}
        </div>

        {/* Kategori Pengumuman */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800">
            Kategori Pengumuman <span className="text-red-500">*</span>
          </label>
          <input type="hidden" name="kategori" value={kategori} />
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: "kegiatan", label: "Kegiatan", icon: Users },
              { id: "perbaikan", label: "Perbaikan", icon: Wrench },
              { id: "keamanan", label: "Keamanan", icon: Shield },
              { id: "iuran", label: "Iuran", icon: CreditCard },
              { id: "umum", label: "Umum", icon: HelpCircle },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = kategori === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setKategori(cat.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 rounded-xl border px-5 py-3 text-xs font-semibold transition-all cursor-pointer min-w-[84px]",
                    isSelected
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-slate-100 bg-[#eef2f9] text-slate-600 hover:bg-[#e4ebf5]"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
          {state?.errors?.kategori && (
            <p className="text-xs font-semibold text-red-500">{state.errors.kategori[0]}</p>
          )}
        </div>

        {/* Tingkat Urgensi / Prioritas Pemberitahuan */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800">
            Tingkat Urgensi / Prioritas Pemberitahuan <span className="text-red-500">*</span>
          </label>
          <input type="hidden" name="urgensi" value={urgensi} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                id: "biasa",
                tag: "Biasa",
                tagColor: "bg-slate-100 text-slate-600",
                title: "Info Rutin",
                desc: "Update santai berkala",
              },
              {
                id: "agenda",
                tag: "Agenda",
                tagColor: "bg-[#090580] text-white",
                title: "Acara Warga",
                desc: "Butuh kehadiran warga",
              },
              {
                id: "penting",
                tag: "Penting",
                tagColor: "bg-[#450a0a] text-white",
                title: "Wajib Tahu",
                desc: "Perlu respon/perhatian",
              },
              {
                id: "darurat",
                tag: "Darurat",
                tagColor: "bg-[#b91c1c] text-white",
                title: "Segera & Kritis",
                desc: "Notifikasi push instan",
              },
            ].map((item) => {
              const isSelected = urgensi === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setUrgensi(item.id)}
                  className={cn(
                    "flex flex-col justify-between rounded-2xl border p-4 transition-all cursor-pointer",
                    isSelected
                      ? "border-2 border-primary bg-[#eef0ff]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide", item.tagColor)}>
                      {item.tag}
                    </span>
                    <span
                      className={cn(
                        "size-4 rounded-full border flex items-center justify-center",
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-slate-300 bg-white"
                      )}
                    >
                      {isSelected && <span className="size-1.5 rounded-full bg-white" />}
                    </span>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs font-bold text-slate-900">{item.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {state?.errors?.urgensi && (
            <p className="text-xs font-semibold text-red-500">{state.errors.urgensi[0]}</p>
          )}
        </div>

        {/* Isi & Uraian Pengumuman */}
        <div className="space-y-1.5">
          <label htmlFor="isi" className="text-xs font-bold text-slate-800">
            Isi &amp; Uraian Pengumuman <span className="text-red-500">*</span>
          </label>
          <textarea
            id="isi"
            name="isi"
            required
            rows={7}
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] p-4 text-xs leading-relaxed text-slate-700 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {state?.errors?.isi && (
            <p className="text-xs font-semibold text-red-500">{state.errors.isi[0]}</p>
          )}
        </div>

        {/* Lokasi / Titik Kumpul Kegiatan */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="lokasi" className="flex items-center gap-1.5 font-bold text-slate-800">
              <MapPin className="size-3.5 text-slate-500" />
              Lokasi / Titik Kumpul Kegiatan
            </label>
            <span className="text-[11px] text-slate-400">
              (Wajib diisi bila berupa acara tatap muka)
            </span>
          </div>
          <input
            id="lokasi"
            name="lokasi"
            type="text"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            placeholder="Lingkungan RT 04 / RW 08 Cluster Sekar Indah"
            className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* KARTU 2: Jadwal & Waktu */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-primary">
            <Clock className="size-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Jadwal &amp; Waktu</h2>
        </div>

        <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pt-1">
          <Calendar className="size-3.5 text-primary" />
          Waktu Pelaksanaan Acara / Kegiatan
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-500">Tanggal Kegiatan:</label>
            <input
              type="text"
              name="tanggal"
              value={tanggal === "2026-09-29" ? "Minggu, 29 September 2026" : tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-2.5 text-xs font-medium text-slate-800 focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-500">Jam / Durasi:</label>
            <input
              type="text"
              name="jam"
              value={jam}
              onChange={(e) => setJam(e.target.value)}
              placeholder="07:00 - 11:30 WIB"
              className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-2.5 text-xs font-medium text-slate-800 focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* KARTU 3: Saluran & Target Distribusi */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-primary">
            <Radio className="size-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Saluran &amp; Target Distribusi</h2>
        </div>

        <p className="text-xs font-bold text-slate-800 pt-1">Lingkup Warga Penerima:</p>

        <input type="hidden" name="target_warga" value={targetWarga} />
        <div className="space-y-3">
          {[
            {
              id: "seluruh",
              title: "Seluruh Warga RT 04",
              desc: "Total 72 Unit Rumah",
            },
            {
              id: "blok_tertentu",
              title: "Pilih Blok Tertentu",
              desc: "Misal hanya Blok A & Blok B yang terdampak perbaikan",
            },
          ].map((target) => {
            const isSelected = targetWarga === target.id;
            return (
              <div
                key={target.id}
                onClick={() => setTargetWarga(target.id)}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl border p-4 transition-all cursor-pointer",
                  isSelected
                    ? "border-primary/40 bg-[#f3f5fc]"
                    : "border-slate-200 bg-[#f8fafc] hover:border-slate-300"
                )}
              >
                <span
                  className={cn(
                    "flex size-4.5 items-center justify-center rounded-full border",
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-slate-300 bg-white"
                  )}
                >
                  {isSelected && <span className="size-1.5 rounded-full bg-white" />}
                </span>

                <div>
                  <p className="text-xs font-bold text-slate-900">{target.title}</p>
                  <p className="text-[11px] text-slate-500">{target.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar: Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-[#fee2e2] px-5 py-3 text-xs font-bold text-[#b91c1c] transition-colors hover:bg-red-200"
        >
          <XCircle className="size-4" />
          Batal / Kembali ke Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            <Save className="size-4 text-slate-500" />
            Simpan Draf
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-[#090580] px-6 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#070468] disabled:opacity-50"
          >
            <Megaphone className="size-4" />
            {isPending ? "Menerbitkan..." : "Publikasikan Pengumuman"}
          </button>
        </div>
      </div>
    </form>
  );
}
