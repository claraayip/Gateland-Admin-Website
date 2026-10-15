"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, X } from "lucide-react";
import { NAV_ITEMS, isActivePath } from "@/lib/navigation";
import { currentUser } from "@/lib/data";
import { cn } from "@/lib/cn";

interface SidebarProps {
  mobileOpen: boolean;
  collapsed: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, collapsed, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay gelap di belakang drawer (hanya mobile) */}
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
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-white px-4 py-6",
          "transition-[transform,width,visibility] duration-200 ease-out lg:translate-x-0 lg:visible",
          mobileOpen ? "visible translate-x-0" : "invisible -translate-x-full",
          collapsed ? "lg:w-[76px] lg:px-3" : "lg:w-[250px]",
        )}
      >
        {/* Brand */}
        <div className="mb-8 flex items-center justify-between px-2">
          <Link
            href="/dashboard"
            aria-label="GateLand - ke Dashboard"
            onClick={onClose}
            className="flex items-center gap-3 text-primary"
          >
            <Image
              src="/assets/logo-gateland.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 object-contain"
              priority
            />
            <span className={cn("text-[22px] font-bold tracking-tight", collapsed && "lg:hidden")}>GateLand</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="rounded-lg p-1.5 text-muted hover:bg-slate-100 lg:hidden"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigasi */}
        <nav aria-label="Menu utama" className="flex-1">
          <p className={cn("mb-3 px-2 text-[11px] font-bold tracking-wide text-slate-400", collapsed && "lg:hidden")}>
            NAVIGASI UTAMA
          </p>
          <ul className="flex flex-col gap-1.5">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = isActivePath(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-control px-3.5 py-2.5 font-medium transition-colors",
                      active ? "bg-primary text-white" : "text-muted hover:bg-slate-100 hover:text-primary",
                      collapsed && "lg:justify-center lg:px-0",
                    )}
                  >
                    <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                    <span className={cn(collapsed && "lg:sr-only")}>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Kartu pengguna */}
        <div
          className={cn(
            "rounded-xl border border-line bg-slate-50 p-3",
            collapsed && "lg:border-0 lg:bg-transparent lg:p-0",
          )}
        >
          <div className={cn("flex items-center gap-3", collapsed && "lg:justify-center")}>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-indigo-100 text-primary">
              <User className="size-5" aria-hidden="true" />
            </span>
            <div className={cn("min-w-0", collapsed && "lg:hidden")}>
              <p className="truncate text-[13px] font-semibold text-ink">{currentUser.shortName}</p>
              <p className="truncate text-xs text-muted">{currentUser.role}</p>
            </div>
          </div>
          <div
            className={cn(
              "mt-3 flex items-center justify-between border-t border-line pt-3",
              collapsed && "lg:mt-2 lg:justify-center lg:border-0 lg:pt-0",
            )}
          >
            <span className={cn("flex items-center gap-1.5 text-xs text-muted", collapsed && "lg:hidden")}>
              <span className="size-2 rounded-full bg-success" aria-hidden="true" /> Online
            </span>
            <Link
              href="/"
              title="Keluar"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-danger hover:bg-red-50"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span className={cn(collapsed && "lg:sr-only")}>Keluar</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
