import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Pengaturan" };

/** Placeholder: menu "Pengaturan" ada di sidebar asli tetapi pengaturan.html tidak pernah dibuat. */
export default function PengaturanPage() {
  return <PageHeader title="Pengaturan" description="Halaman ini belum tersedia." />;
}
