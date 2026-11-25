"use client";

import type { FormEvent } from "react";
import { UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormInput, FormSelect } from "@/components/ui/FormInput";
import { FormSection } from "@/components/ui/FormSection";
import { Modal } from "@/components/ui/Modal";
import type { Resident } from "@/lib/types";

const FORM_ID = "form-edit-penghuni";

interface EditResidentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData, residentId: string) => void;
  unitOptions: { value: string; label: string }[];
  resident: Resident | null;
}

export function EditResidentModal({
  open,
  onClose,
  onSubmit,
  unitOptions,
  resident,
}: EditResidentModalProps) {
  if (!resident) return null;

  const detail = resident.detail;
  const unitValue = `${resident.block.replace("Blok ", "")}-${resident.number.replace("No. ", "")}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (resident) {
      onSubmit(new FormData(event.currentTarget), resident.id);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Data Penghuni"
      badge={<Badge tone="indigo">Formulir Warga</Badge>}
      description="Perbarui informasi data warga, unit kavling, dan akses kendaraan Klaster Gardenia & Boulevard RT 04 / RW 08."
      icon={<UserCheck className="size-5" aria-hidden="true" />}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" form={FORM_ID}>
            Simpan Perubahan
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
        <FormSection variant="plain" marker="A" title="Identitas Kepala Keluarga (Akun Warga)" subtitle="* Wajib diisi">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              name="name"
              label="Nama Lengkap (Sesuai KTP)"
              defaultValue={resident.name}
              required
            />
            <FormInput
              name="address"
              label="Alamat Rumah (Sesuai KTP)"
              defaultValue={detail?.address ?? `${resident.block} ${resident.number}`}
              required
            />
            <FormInput
              name="emergency"
              type="tel"
              label="Nomor Kontak Darurat (Anggota Keluarga)"
              defaultValue={detail?.emergencyContact?.phone ?? ""}
              placeholder="0866-5555-0000"
            />
            <FormInput
              name="whatsapp"
              type="tel"
              label="Nomor WhatsApp Aktif"
              defaultValue={resident.phone}
              required
            />
            <FormInput
              name="email"
              type="email"
              label="Alamat Email (Opsional)"
              defaultValue={detail?.email ?? ""}
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
              defaultValue={unitValue}
              options={unitOptions}
              required
              wrapperClassName="sm:col-span-2"
            />
            <FormInput
              name="startDate"
              type="date"
              label="Tanggal Mulai Menempati"
              defaultValue="2026-01-10"
              required
            />
            <FormInput
              name="endDate"
              type="date"
              label="Masa Kontrak Berakhir"
              hint="Khusus sewa"
            />
          </div>
        </FormSection>

        <FormSection variant="plain" marker="C" title="Anggota Keluarga & Akses RFID Gerbang">
          <div className="grid gap-4 sm:grid-cols-3">
            <FormInput
              name="members"
              type="number"
              min={1}
              label="Jumlah Anggota Keluarga"
              defaultValue={resident.memberCount ?? detail?.members.length ?? 1}
            />
            <FormInput
              name="plate1"
              label="Plat Kendaraan 1 (Mobil)"
              defaultValue={detail?.vehicles?.[0]?.plate ?? ""}
              placeholder="N 1234 ABC"
            />
            <FormInput
              name="plate2"
              label="Plat Kendaraan 2 (Motor)"
              defaultValue={detail?.vehicles?.[1]?.plate ?? ""}
              placeholder="N 5678 XYZ"
            />
          </div>
        </FormSection>
      </form>
    </Modal>
  );
}