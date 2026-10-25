"use client";

import { Menu, Megaphone, PanelLeftClose, PanelLeftOpen, Search, User } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@/lib/data";

interface HeaderProps {
  mobileOpen: boolean;
  collapsed: boolean;
  onOpenMobileMenu: () => void;
  onToggleCollapsed: () => void;
}

const iconButton =
  "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#050C9C]";

export function Header({
  mobileOpen,
  collapsed,
  onOpenMobileMenu,
  onToggleCollapsed,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur sm:gap-4 sm:px-6 lg:px-8 font-sans">
      {/* Mobile: buka drawer */}
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="Buka menu navigasi"
        aria-expanded={mobileOpen}
        aria-controls="app-sidebar"
        className={`${iconButton} lg:hidden`}
      >
        <Menu className="size-5" />
      </button>

      {/* Desktop: ciutkan / perluas sidebar */}
      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
        aria-controls="app-sidebar"
        className={`${iconButton} hidden lg:inline-flex`}
      >
        {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
      </button>

      {/* Search Input */}
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="relative min-w-0 max-w-xl flex-1"
      >
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          aria-label="Cari"
          placeholder="Cari data warga, unit kavling, bukti iuran..."
          className="w-full rounded-xl bg-[#F1F3FD] border-0 py-2.5 pr-4 pl-10 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#050C9C]/20 transition"
        />
      </form>

      {/* Action Button & Profile */}
      <div className="ml-auto flex items-center gap-4">
        {/* + Buat Pengumuman */}
        <Link
          href="/pengumuman"
          className="inline-flex items-center gap-2 rounded-full bg-[#050C9C] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-[#040878] transition cursor-pointer"
        >
          <Megaphone className="size-4" />
          <span>+ Buat Pengumuman</span>
        </Link>

        {/* User Info */}
        <div className="flex items-center gap-2.5">
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-xs font-bold text-slate-900">Admin Aktif</p>
            <p className="text-[11px] text-slate-500">GateLand RT 04/RW 08</p>
          </div>
          <div className="size-9 rounded-full bg-[#050C9C] text-white flex items-center justify-center font-bold">
            <User className="size-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
