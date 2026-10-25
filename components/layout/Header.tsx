"use client";

import { CircleUser, Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { buttonClasses } from "@/components/ui/Button";
import Link from "next/link";
import { getHeaderAction } from "@/lib/navigation";
import { currentUser } from "@/lib/data";

interface HeaderProps {
  mobileOpen: boolean;
  collapsed: boolean;
  onOpenMobileMenu: () => void;
  onToggleCollapsed: () => void;
}

const iconButton =
  "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-muted transition-colors hover:bg-slate-100 hover:text-primary";

export function Header({ mobileOpen, collapsed, onOpenMobileMenu, onToggleCollapsed }: HeaderProps) {
  const action = getHeaderAction(usePathname());
  const ActionIcon = action.icon;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-line bg-white/90 px-4 py-3 backdrop-blur sm:gap-3 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="Buka menu navigasi"
        aria-expanded={mobileOpen}
        aria-controls="app-sidebar"
        className={`${iconButton} lg:hidden`}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
        aria-controls="app-sidebar"
        className={`${iconButton} hidden lg:inline-flex`}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-5" aria-hidden="true" />
        ) : (
          <PanelLeftClose className="size-5" aria-hidden="true" />
        )}
      </button>

      <form role="search" onSubmit={(event) => event.preventDefault()} className="relative min-w-0 max-w-xl flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          aria-label="Cari"
          placeholder="Cari data warga, unit kavling, bukti iuran..."
          className="w-full rounded-full border border-line bg-slate-50 py-2.5 pr-4 pl-10 text-sm placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none"
        />
      </form>

      <div className="ml-auto flex items-center gap-3">
        <Link href={action.href} className={buttonClasses({ size: "sm" })}>
          <ActionIcon className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{action.label}</span>
          <span className="sr-only sm:hidden">{action.label}</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="hidden text-right leading-tight md:block">
            <p className="text-[13px] font-semibold text-ink">Admin Aktif</p>
            <p className="text-[11px] text-muted">{currentUser.location}</p>
          </div>
          <CircleUser className="size-8 text-primary" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
