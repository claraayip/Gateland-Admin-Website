"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { FormInput, FormTextarea } from "@/components/ui/FormInput";
import { FormSection } from "@/components/ui/FormSection";
import { PageHeader } from "@/components/ui/PageHeader";

const TITLE_LIMIT = 120;

export function BuatPengumumanForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    // TODO: kirim `payload` ke API. Versi asli memakai alert() lalu redirect.
    console.info("Pengumuman:", payload);
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PageHeader
        eyebrow={
          <>
            <Link href="/dashboard" className="hover:text-primary hover:underline">Dashboard</Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <span>Pengumuman & Warga</span>
          </>
        }
        title="Buat Pengumuman Baru"
        actions={
          <>
            <ButtonLink href="/dashboard" variant="ghost">
              <ArrowLeft className="size-4" aria-hidden="true" /> Kembali ke Dashboard
            </ButtonLink>
            <Button variant="outline">Simpan Draf</Button>
          </>
        }
      />

      <FormSection marker="1" title="Detail Pengumuman">
        <FormInput
          name="judul"
          label="Judul Pengumuman"
          required
          maxLength={TITLE_LIMIT}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Contoh: Kerja Bakti Massal"
          hint="Buat judul singkat, jelas, dan memuat tujuan utama pesan."
          labelTrailing={<span className="text-[11px] text-muted">{title.length} / {TITLE_LIMIT} karakter</span>}
        />

        <ChoiceGroup
          name="kategori"
          legend="Kategori Pengumuman"
          required
          defaultValue="kegiatan"
          options={[
            { value: "kegiatan", label: "Kegiatan" },
            { value: "perbaikan", label: "Perbaikan" },
            { value: "keamanan", label: "Keamanan" },
            { value: "iuran", label: "Iuran" },
            { value: "umum", label: "Umum" },
          ]}
        />

        <ChoiceGroup
          name="urgensi"
          legend="Tingkat Urgensi / Prioritas Pemberitahuan"
          variant="card"
          required
          defaultValue="agenda"
          columnsClassName="sm:grid-cols-2 xl:grid-cols-4"
          options={[
            { value: "biasa", label: "Biasa", title: "Info Rutin", description: "Update santai berkala" },
            { value: "agenda", label: "Agenda", title: "Acara Warga", description: "Butuh kehadiran warga" },
            { value: "penting", label: "Penting", title: "Wajib Tahu", description: "Perlu respon/perhatian" },
            { value: "darurat", label: "Darurat", title: "Segera & Kritis", description: "Notifikasi push instan" },
          ]}
        />

        <FormTextarea
          name="isi"
          label="Isi & Uraian Pengumuman"
          required
          rows={6}
          placeholder={"Yth. Bapak/Ibu Warga RT 04 / RW 08,\n\nTulis isi pengumuman di sini."}
        />

        <FormInput
          name="lokasi"
          label="Lokasi / Titik Kumpul Kegiatan"
          hint="(Wajib diisi bila berupa acara tatap muka)"
          placeholder="Lingkungan RT 04 / RW 08 Cluster Sekar Indah"
        />
      </FormSection>

      <FormSection marker="2" title="Jadwal & Waktu" subtitle="Waktu Pelaksanaan Acara / Kegiatan">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput name="tanggal" type="date" label="Tanggal Kegiatan" />
          <FormInput name="jam" label="Jam / Durasi" placeholder="07:00 - 11:30 WIB" />
        </div>
      </FormSection>

      <FormSection marker="3" title="Saluran & Target Distribusi" subtitle="Lingkup Warga Penerima">
        <ChoiceGroup
          name="target_warga"
          legend="Lingkup Warga Penerima"
          variant="card"
          defaultValue="seluruh"
          options={[
            { value: "seluruh", label: "Seluruh Warga RT 04", description: "Total 72 unit rumah" },
            { value: "blok_tertentu", label: "Pilih Blok Tertentu", description: "Misal hanya Blok A & Blok B yang terdampak perbaikan." },
          ]}
        />
      </FormSection>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <ButtonLink href="/dashboard" variant="outline">Batal / Kembali ke Dashboard</ButtonLink>
        <Button variant="outline">Simpan Draf</Button>
        <Button type="submit">Publikasikan Pengumuman</Button>
      </div>
    </form>
  );
}
