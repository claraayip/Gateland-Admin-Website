import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Server, Database, Shield, Radio, Bell, Save, UserCheck, Smartphone } from "lucide-react";

export const metadata: Metadata = { title: "Pengaturan Sistem" };

export default function PengaturanPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<Badge tone="purple">Pusat Konfigurasi & Integrasi</Badge>}
        title="Pengaturan Klaster & Sistem GateLand"
        description="Kelola profil pengelola, status integrasi backend, preferensi notifikasi klaster, dan akses keamanan sistem."
        actions={
          <div className="flex items-center gap-2">
            <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700">Semua Layanan Berjalan Normal</span>
          </div>
        }
      />

      {/* Grid Status Layanan & Infrastruktur */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Backend API</span>
            <Server className="size-4 text-primary" />
          </div>
          <p className="text-lg font-bold text-ink">Port 3000</p>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
            <CheckCircle2 className="size-3.5" /> Terhubung (Online)
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Database MySQL</span>
            <Database className="size-4 text-primary" />
          </div>
          <p className="text-lg font-bold text-ink">Docker 3306</p>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
            <CheckCircle2 className="size-3.5" /> Siap &amp; Tersinkron
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Real-time Socket</span>
            <Radio className="size-4 text-primary" />
          </div>
          <p className="text-lg font-bold text-ink">Socket.IO</p>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
            <CheckCircle2 className="size-3.5" /> Realtime Active
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Aplikasi Mobile</span>
            <Smartphone className="size-4 text-primary" />
          </div>
          <p className="text-lg font-bold text-ink">Flutter v3.x</p>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
            <CheckCircle2 className="size-3.5" /> Integrasi Penuh
          </div>
        </Card>
      </div>

      {/* Profil Pengelola & Identitas Klaster */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-line">
            <div className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-primary">
              <UserCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Profil Akun Pengelola Aktif</h3>
              <p className="text-xs text-muted">Kredensial resmi administrator website RT 04 / RW 08</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-ink mb-1">Nama Pengelola</label>
              <input
                type="text"
                readOnly
                defaultValue="Andi Putra Wijaya (Admin GateLand)"
                className="w-full rounded-xl border border-line bg-slate-50 px-3.5 py-2.5 text-slate-700 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-ink mb-1">Email Administrator</label>
              <input
                type="text"
                readOnly
                defaultValue="admin@gmail.com"
                className="w-full rounded-xl border border-line bg-slate-50 px-3.5 py-2.5 text-slate-700 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-ink mb-1">Peran Akses (Role)</label>
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-primary">
                ADMINISTRATOR UTAMA
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-line">
            <div className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-primary">
              <Shield className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink">Identitas Klaster &amp; Lingkungan</h3>
              <p className="text-xs text-muted">Informasi wilayah operasional perumahan</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-ink mb-1">Nama Klaster / Perumahan</label>
              <input
                type="text"
                readOnly
                defaultValue="Klaster Sekar Indah (Gardenia & Boulevard)"
                className="w-full rounded-xl border border-line bg-slate-50 px-3.5 py-2.5 text-slate-700 font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-ink mb-1">Rukun Tetangga (RT)</label>
                <input
                  type="text"
                  readOnly
                  defaultValue="RT 04"
                  className="w-full rounded-xl border border-line bg-slate-50 px-3.5 py-2.5 text-slate-700 font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-ink mb-1">Rukun Warga (RW)</label>
                <input
                  type="text"
                  readOnly
                  defaultValue="RW 08"
                  className="w-full rounded-xl border border-line bg-slate-50 px-3.5 py-2.5 text-slate-700 font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-ink mb-1">Pos Keamanan &amp; Gerbang</label>
              <input
                type="text"
                readOnly
                defaultValue="Pos Satpam Utama Blok A (Hotline: +62 811-9283-001)"
                className="w-full rounded-xl border border-line bg-slate-50 px-3.5 py-2.5 text-slate-700 font-medium"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Otomasi & Notifikasi */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-line">
          <div className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-primary">
            <Bell className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink">Preferensi Notifikasi &amp; Penagihan Warga</h3>
            <p className="text-xs text-muted">Pengaturan otomatisasi pengingat iuran dan broadcast</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-line bg-slate-50/50 cursor-pointer hover:bg-slate-50">
            <input type="checkbox" defaultChecked className="size-4 accent-primary rounded" />
            <div>
              <p className="font-bold text-ink">Broadcast Real-time Pengumuman ke Mobile</p>
              <p className="text-muted">Setiap pengumuman yang diterbitkan otomatis muncul di notifikasi HP warga.</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-line bg-slate-50/50 cursor-pointer hover:bg-slate-50">
            <input type="checkbox" defaultChecked className="size-4 accent-primary rounded" />
            <div>
              <p className="font-bold text-ink">Verifikasi Instan QRIS Dinamis</p>
              <p className="text-muted">Pembayaran warga yang menggunakan QRIS akan langsung tercatat Lunas tanpa perlu validasi manual.</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-line bg-slate-50/50 cursor-pointer hover:bg-slate-50">
            <input type="checkbox" defaultChecked className="size-4 accent-primary rounded" />
            <div>
              <p className="font-bold text-ink">Peringatan Jatuh Tempo Tanggal 10</p>
              <p className="text-muted">Kirim pengingat otomatis ke warga yang belum membayar iuran setiap tanggal 10 awal bulan.</p>
            </div>
          </label>
        </div>
      </Card>
    </div>
  );
}
