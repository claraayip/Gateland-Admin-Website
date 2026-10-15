import type { Metadata } from "next";
import { BuatIuranForm } from "@/components/forms/BuatIuranForm";

export const metadata: Metadata = { title: "Buat Iuran Baru" };

export default function BuatIuranPage() {
  return <BuatIuranForm />;
}
