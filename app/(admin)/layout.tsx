import type { ReactNode } from "react";
import { AdminShell } from "@/components/layout/AdminShell";

/**
 * Layout bersama untuk semua halaman admin.
 * Folder `(admin)` adalah route group: TIDAK muncul di URL
 * (/dashboard tetap /dashboard), tetapi membuat halaman login (app/page.tsx)
 * berada di luar layout ini sehingga tidak ikut menampilkan Sidebar & Header.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
