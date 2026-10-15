import {
  FileText,
  LayoutDashboard,
  Megaphone,
  Plus,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Satu sumber kebenaran untuk menu sidebar. Tambah halaman baru cukup di sini. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Penghuni", href: "/penghuni", icon: Users },
  { label: "Iuran", href: "/iuran", icon: Wallet },
  { label: "Laporan", href: "/laporan", icon: FileText },
  { label: "Pengaturan", href: "/pengaturan", icon: Settings },
];

/** Menu aktif juga untuk sub-halaman, mis. /iuran/buat menandai "Iuran". */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export interface HeaderAction {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Tombol aksi utama di Header berubah mengikuti konteks halaman. */
export function getHeaderAction(pathname: string): HeaderAction {
  if (pathname.startsWith("/iuran")) {
    return { label: "Buat Iuran", href: "/iuran/buat", icon: Plus };
  }
  return { label: "Buat Pengumuman", href: "/pengumuman/buat", icon: Megaphone };
}
