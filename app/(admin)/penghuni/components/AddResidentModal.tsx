"use client";

import type { FormEvent } from "react";
import { UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormInput, FormSelect } from "@/components/ui/FormInput";
import { FormSection } from "@/components/ui/FormSection";
import { Modal } from "@/components/ui/Modal";

const FORM_ID = "form-tambah-penghuni";

interface AddResidentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  unitOptions: { value: string; label: string }[];
}

export function AddResidentModal({ open, onClose, onSubmit, unitOptions }: AddResidentModalProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(new FormData(event.currentTarget));
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tambah Penghuni Baru"
      badge={<Badge tone="indigo">Formulir Warga</Badge>}
      description="Daftarkan warga baru ke direktori hunian Klaster Gardenia & Boulevard RT 04 / RW 08."
      icon={<UserPlus className="size-5" aria-hidden="true" />}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" form={FORM_ID}>
            Simpan dan Tambahkan Penghuni
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
        <FormSection variant="plain" marker="A" title="Identitas Kepala Keluarga (Akun Warga)" subtitle="* Wajib diisi">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput name="name" label="Nama Lengkap (Sesuai KTP)" placeholder="Ibu Azizah Pratama" required />
            <FormInput name="address" label="Alamat Rumah (Sesuai KTP)" placeholder="Jl. Sekar Indah Blok A1 No. 7" required />
            <FormInput name="emergency" type="tel" label="Nomor Kontak Darurat (Anggota Keluarga)" placeholder="0866-5555-0000" />
            <FormInput name="whatsapp" type="tel" label="Nomor WhatsApp Aktif" placeholder="0812-8899-7721" required />
            <FormInput
              name="email"
              type="email"
              label="Alamat Email (Opsional)"
              placeholder="aditya.pratama@gmail.com"
              wrapperClassName="sm:col-span-2"
            />
          </div>
        </FormSection>

        <FormSection variant="plain" marker="B" title="Unit Kavling" subtitle="Pilihan blok & nomor unit kavling">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormSelect
              name="unit"
              label="Pilihan Blok & Nomor Unit Kavling"
              placeholder="Pilih unit yang tersedia"
              options={unitOptions}
              required
              wrapperClassName="sm:col-span-2"
            />
            <FormInput name="startDate" type="date" label="Tanggal Mulai Menempati" required />
            <FormInput name="endDate" type="date" label="Masa Kontrak Berakhir" hint="Khusus sewa" />
          </div>
        </FormSection>

        <FormSection variant="plain" marker="C" title="Anggota Keluarga & Akses RFID Gerbang">
          <div className="grid gap-4 sm:grid-cols-3">
            <FormInput name="members" type="number" min={1} label="Jumlah Anggota Keluarga" placeholder="4" />
            <FormInput name="plate1" label="Plat Kendaraan 1 (Mobil)" placeholder="N 1234 ABC" />
            <FormInput name="plate2" label="Plat Kendaraan 2 (Motor)" placeholder="N 5678 XYZ" />
          </div>
        </FormSection>
      </form>
    </Modal>
  );
}
