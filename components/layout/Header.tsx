"use client";

import { useState } from "react";
import { Megaphone, Menu, PanelLeftClose, PanelLeftOpen, Plus, Search, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { getHeaderAction } from "@/lib/navigation";
import { Modal } from "@/components/ui/Modal";
import { BuatIuranForm } from "@/components/forms/BuatIuranForm";
import { BuatPengumumanForm } from "@/components/forms/BuatPengumumanForm";

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
  const pathname = usePathname();
  const router = useRouter();
  const action = getHeaderAction(pathname);
  const ActionIcon = action.icon;
  const isIuranAction = pathname.startsWith("/iuran");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
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
          {/* Tombol popup modal dengan 1 ikon saja */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#050C9C] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-[#040878] transition cursor-pointer"
          >
            <ActionIcon className="size-4" aria-hidden="true" />
            <span>{action.label}</span>
          </button>

          {/* User Info */}
          <div className="flex items-center gap-2.5">
            <div className="hidden text-right leading-tight sm:block">
              <p className="text-xs font-bold text-slate-900">Admin Aktif</p>
              <p className="text-[11px] text-slate-500">Cluster GateLand</p>
            </div>
            <div className="size-9 rounded-full bg-[#050C9C] text-white flex items-center justify-center font-bold">
              <User className="size-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Pop-up Modal dengan backdrop blur untuk Buat Iuran / Buat Pengumuman */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
        title={isIuranAction ? "Buat Iuran Baru" : "Buat Pengumuman Baru"}
        description={
          isIuranAction
            ? "Terbitkan skema tagihan iuran baru untuk seluruh warga atau blok tertentu di Cluster GateLand."
            : "Terbitkan pengumuman atau agenda terbaru untuk seluruh warga Cluster GateLand."
        }
        icon={isIuranAction ? <Plus className="size-5" aria-hidden="true" /> : <Megaphone className="size-5" aria-hidden="true" />}
      >
        {isIuranAction ? (
          <BuatIuranForm
            embedded
            onCancel={() => setModalOpen(false)}
            onSuccess={() => {
              setModalOpen(false);
              router.refresh();
            }}
          />
        ) : (
          <BuatPengumumanForm
            embedded
            onCancel={() => setModalOpen(false)}
            onSuccess={() => {
              setModalOpen(false);
              router.refresh();
            }}
          />
        )}
      </Modal>
    </>
  );
}
