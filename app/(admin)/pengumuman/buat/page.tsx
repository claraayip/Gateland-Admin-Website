import type { Metadata } from "next";
import { BuatPengumumanForm } from "@/components/forms/BuatPengumumanForm";

export const metadata: Metadata = { title: "Buat Pengumuman" };

export default function BuatPengumumanPage() {
  return <BuatPengumumanForm />;
}
