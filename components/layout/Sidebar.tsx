"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface SidebarProps {
  mobileOpen: boolean;
  collapsed: boolean;
  onClose: () => void;
}

const SIDEBAR_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Penghuni", href: "/penghuni", icon: Users },
  { label: "Iuran", href: "/iuran", icon: CreditCard },
  { label: "Laporan", href: "/laporan", icon: BarChart3 },
  { label: "Pengaturan", href: "/pengaturan", icon: Settings },
];

export function Sidebar({ mobileOpen, collapsed, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay mobile */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/50 transition-opacity duration-200 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        id="app-sidebar"
        aria-label="Sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-100 bg-white px-4 py-6 font-sans",
          "transition-[transform,width,visibility] duration-200 ease-out lg:translate-x-0 lg:visible",
          mobileOpen ? "visible translate-x-0" : "invisible -translate-x-full",
          collapsed ? "lg:w-[76px] lg:px-3" : "lg:w-[250px]",
        )}
      >
        {/* Brand */}
        <div className="mb-8 flex items-center justify-between px-2">
          <Link
            href="/dashboard"
            aria-label="GateLand"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <Image
              src="/assets/logo-gateland.png"
              alt="GateLand"
              width={34}
              height={34}
              className="h-8 w-8 shrink-0 object-contain"
              priority
            />
            <span className={cn("text-[22px] font-extrabold tracking-tight text-[#0A1282]", collapsed && "lg:hidden")}>
              GateLand
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Menu Navigasi */}
        <nav aria-label="Menu utama" className="flex-1">
          <p className={cn("mb-3 px-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase", collapsed && "lg:hidden")}>
            NAVIGASI UTAMA
          </p>
          <ul className="flex flex-col gap-1.5">
            {SIDEBAR_NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                      active
                        ? "bg-[#050C9C] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      collapsed && "lg:justify-center lg:px-0",
                    )}
                  >
                    <Icon className="size-[18px] shrink-0" />
                    <span className={cn(collapsed && "lg:sr-only")}>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Kartu Pengguna di Bawah */}
        <div
          className={cn(
            "rounded-2xl bg-[#EFF1FD] p-4",
            collapsed && "lg:bg-transparent lg:p-0",
          )}
        >
          <div className={cn("flex items-center gap-3", collapsed && "lg:justify-center")}>
            <div className="size-10 shrink-0 rounded-full bg-[#050C9C] text-white flex items-center justify-center font-bold">
              <User className="size-5" />
            </div>
            <div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}>
              <p className="truncate text-sm font-bold text-slate-900">Andi Putra Wijaya</p>
              <p className="truncate text-xs text-slate-500">Pengelola</p>
            </div>
          </div>

          <div
            className={cn(
              "mt-3 flex items-center justify-between border-t border-slate-200/60 pt-3",
              collapsed && "lg:hidden",
            )}
          >
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <span className="size-2 rounded-full bg-emerald-500" /> Online
            </span>
            <button
              type="button"
              onClick={() => {
                document.cookie = "gateland_token=; path=/; max-age=0; SameSite=Lax";
                localStorage.removeItem("gateland_token");
                localStorage.removeItem("gateland_user");
                window.location.replace("/");
              }}
              title="Keluar"
              className="flex cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-1 text-xs font-semibold text-slate-600 hover:text-rose-600 transition"
            >
              <LogOut className="size-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
