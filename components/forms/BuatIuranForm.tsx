"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { FormInput, FormTextarea } from "@/components/ui/FormInput";
import { FormSection } from "@/components/ui/FormSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";

const NAME_LIMIT = 60;
const PRESETS = [15_000, 20_000, 30_000, 50_000, 75_000];
type Scheme = "flat" | "proporsional";

const checkboxClass = "mt-0.5 size-4 shrink-0 rounded border-line accent-primary";

export function BuatIuranForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [scheme, setScheme] = useState<Scheme>("flat");
  const [amount, setAmount] = useState<number>(20_000);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = { ...Object.fromEntries(new FormData(event.currentTarget)), scheme, amount };
    console.info("Iuran baru:", payload);
    router.push("/iuran");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PageHeader
        eyebrow={
          <>
            <Link href="/dashboard" className="hover:text-primary hover:underline">Dashboard</Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <Link href="/iuran" className="hover:text-primary hover:underline">Iuran & Tagihan</Link>
          </>
        }
        title="Buat Master Pos Iuran Baru"
        description="Terbitkan skema tagihan iuran baru untuk seluruh warga klaster, blok tertentu, atau iuran kegiatan insidental secara terstruktur dan terotomatisasi."
        actions={
          <>
            <ButtonLink href="/iuran" variant="ghost">
              <ArrowLeft className="size-4" aria-hidden="true" /> Kembali ke Manajemen Iuran
            </ButtonLink>
            <Button variant="outline">Simpan Draf</Button>
          </>
        }
      />

      <FormSection
        marker="1"
        title="Detail Master Iuran"
        subtitle="Langkah 1 dari 2: Informasi dasar pos, preset & sasaran"
        aside={<Badge tone="indigo">Wajib Diisi</Badge>}
      >
        <FormInput
          name="namaIuran"
          label="Nama Iuran"
          required
          maxLength={NAME_LIMIT}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Contoh: Iuran Perawatan Lampu PJU & CCTV 2026"
          hint="Buat nama pos iuran yang jelas, mudah dipahami warga, dan transparan."
          labelTrailing={<span className="text-[11px] text-muted">{name.length} / {NAME_LIMIT}</span>}
        />

        <ChoiceGroup
          name="tipe_iuran"
          legend="Tipe & Sifat Iuran"
          required
          defaultValue="wajib_rutin"
          options={[
            { value: "wajib_rutin", label: "Wajib Rutin" },
            { value: "khusus", label: "Khusus / Proyek" },
            { value: "insidental", label: "Insidental" },
            { value: "sukarela", label: "Sukarela / Donasi" },
            { value: "lainnya", label: "Lainnya" },
          ]}
        />

        <ChoiceGroup
          name="sasaran"
          legend="Sasaran Unit Penghuni"
          variant="card"
          required
          defaultValue="semua"
          columnsClassName="sm:grid-cols-3"
          options={[
            { value: "semua", label: "Semua Warga", title: "72 KK", description: "Seluruh unit terdaftar" },
            { value: "dihuni", label: "Unit Dihuni", title: "72 KK", description: "Pemilik rumah aktif" },
            { value: "blok", label: "Pilih Blok", title: "Blok A – C", description: "Pilihan kavling tertentu" },
          ]}
        />

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold text-ink">
              Skema & Besaran Nominal Tagihan <span className="text-danger" aria-hidden="true">*</span>
            </p>
            <div role="group" aria-label="Skema tagihan" className="flex gap-1 rounded-full bg-slate-100 p-1">
              {([["flat", "Flat per Rumah / KK"], ["proporsional", "Proporsional Kavling"]] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={scheme === value}
                  onClick={() => setScheme(value)}
                  className={cn(
                    "cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                    scheme === value ? "bg-primary text-white" : "text-muted hover:text-ink",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FormInput
              name="nominal"
              label="Nominal"
              inputMode="numeric"
              wrapperClassName="flex-1"
              leading={<span className="text-sm font-semibold">Rp</span>}
              value={amount ? amount.toLocaleString("id-ID") : ""}
              onChange={(event) => setAmount(Number(event.target.value.replace(/\D/g, "")))}
              hint={`Tagihan per bulan: ${formatRupiah(amount)}`}
            />
            <span className="mt-1 text-xs text-muted">/bulan</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">Preset Nominal:</span>
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={amount === preset}
                onClick={() => setAmount(preset)}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  amount === preset ? "border-primary bg-indigo-50 text-primary" : "border-line text-muted hover:border-slate-300",
                )}
              >
                {formatRupiah(preset)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FormTextarea
            name="uraian"
            label="Uraian & Rincian Alokasi Dana Iuran"
            rows={4}
            placeholder="Jelaskan peruntukan dana iuran ini."
            hint="Uraian ini akan muncul di rincian tagihan lembar pembukuan warga."
          />
          <label className="mt-3 flex items-start gap-2.5 text-xs text-ink">
            <input type="checkbox" name="tampilkanUraian" defaultChecked className={checkboxClass} />
            Tampilkan uraian pada tagihan warga
          </label>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-ink">Rekening Kas RT Penerima</p>
            <p className="mt-1 text-sm font-semibold text-ink">BCA - Kas Paguyuban RT 04 GateLand</p>
            <p className="text-xs text-muted">No. Rek: 827-029-1920, a.n. Kas Paguyuban Sekar Indah</p>
            <div className="mt-2 flex gap-2">
              <Badge tone="green">Aktif</Badge>
              <Badge tone="indigo">Utama</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:max-w-xs">
            <div className="text-xs">
              <p className="font-semibold text-ink">QRIS Statis & Dinamis Otomatis</p>
              <p className="text-muted">Generasi QRIS instan bagi warga untuk kemudahan verifikasi sistem</p>
            </div>
            <Switch name="qris" label="Aktifkan QRIS otomatis" defaultChecked />
          </div>
        </div>
      </FormSection>

      <FormSection marker="2" title="Jadwal & Batas Jatuh Tempo">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormInput name="frekuensi" label="Frekuensi Tagihan" defaultValue="Bulanan (Setiap Bulan)" />
          <FormInput name="jatuhTempo" label="Batas Jatuh Tempo" defaultValue="Setiap Tanggal 10" />
          <FormInput name="mulaiBerlaku" label="Mulai Berlaku Pada Periode" placeholder="Oktober 2026" />
        </div>

        <fieldset className="space-y-3">
          <legend className="mb-1 text-sm font-bold text-ink">Otomasi & Kanal Pemberitahuan</legend>
          {[
            { name: "pushNotif", title: "Push Notification Aplikasi GateLand", desc: "Kirim notifikasi tagihan otomatis pada tgl 10 awal bulan ke ponsel seluruh warga." },
            { name: "banner", title: "Banner Pengingat di Beranda Warga", desc: "Tampilkan banner catatan pos baru pada dashboard warga yang belum membayar." },
          ].map((item) => (
            <label key={item.name} className="flex items-start gap-2.5 text-xs">
              <input type="checkbox" name={item.name} defaultChecked className={checkboxClass} />
              <span>
                <span className="block font-semibold text-ink">{item.title}</span>
                <span className="text-muted">{item.desc}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </FormSection>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <ButtonLink href="/iuran" variant="outline">Batal / Kembali</ButtonLink>
        {/* Catatan: di HTML asli tombol ini keliru berlabel "Publikasikan Pengumuman". */}
        <Button type="submit">Terbitkan Iuran</Button>
      </div>
    </form>
  );
}
