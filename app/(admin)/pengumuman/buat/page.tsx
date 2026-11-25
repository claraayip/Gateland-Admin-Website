import type { Metadata } from "next";
import { BuatPengumumanForm } from "../components/BuatPengumumanForm";

export const metadata: Metadata = { title: "Buat Pengumuman Baru" };

export default function BuatPengumumanPage() {
  return <BuatPengumumanForm />;
}