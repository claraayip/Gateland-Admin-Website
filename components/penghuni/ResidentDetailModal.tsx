"use client";

import type { ReactNode } from "react";
import { CircleCheck, Mail, Phone } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatRupiah, getInitials } from "@/lib/format";
import type { Resident } from "@/lib/types";

interface ResidentDetailModalProps {
  resident: Resident | null;
  onClose: () => void;
}

function Panel({ title, aside, children }: { title: string; aside?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-line p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-[13px] font-bold text-ink">{title}</h3>
        {aside && <span className="text-xs font-semibold text-primary">{aside}</span>}
      </div>
      {children}
    </section>
  );
}

export function ResidentDetailModal({ resident, onClose }: ResidentDetailModalProps) {
  const detail = resident?.detail;
  const verified = resident?.status === "aktif";

  return (
    <Modal
      open={resident !== null}
      onClose={onClose}
      title="Detail Data Warga & Hunian"
      badge={
        verified ? (
          <Badge tone="green">
            <CircleCheck className="size-3" aria-hidden="true" /> Terverifikasi RT 04
          </Badge>
        ) : (
          <Badge tone="darkred">Menunggu Verifikasi</Badge>
        )
      }
      description="Informasi kependudukan, kontak keluarga, akses gerbang RFID, dan status iuran Klaster GateLand."
      footer={<Button onClick={onClose}>Tutup</Button>}
    >
      {resident && (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar initials={getInitials(resident.name)} tone="navy" size="lg" />
            <div className="min-w-0 space-y-1">
              <h3 className="text-lg font-bold text-ink">{resident.name}</h3>
              <p className="text-xs text-muted">
                {detail ? `${detail.ownership} • ` : ""}
                {verified ? "Aktif" : "Baru Registrasi"}
              </p>
              <p className="text-xs text-muted">{detail?.address ?? `${resident.block} ${resident.number}`}</p>
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-3.5 text-muted" aria-hidden="true" /> {resident.phone}
                </span>
                {detail && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-3.5 text-muted" aria-hidden="true" /> {detail.email}
                  </span>
                )}
              </p>
            </div>
            {detail && (
              <div className="rounded-xl bg-slate-50 px-4 py-2 text-xs sm:ml-auto">
                <p className="text-muted">Terdaftar Sejak</p>
                <p className="font-semibold text-ink">{detail.since}</p>
                <p className="text-muted">Masa Huni: {detail.tenure}</p>
              </div>
            )}
          </div>

          {!detail ? (
            <p className="rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-muted">
              Data kependudukan, kendaraan, dan rincian iuran lengkap belum tersedia untuk warga ini. Status iuran
              saat ini: <strong className="text-ink">{resident.payment.label}</strong>.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <Panel title="Data Kependudukan & Keluarga" aside={`${resident.memberCount} Jiwa`}>
                <ol className="space-y-2 text-xs">
                  {detail.members.map((member, index) => (
                    <li key={member.name} className="flex items-baseline justify-between gap-3">
                      <span className="font-medium text-ink">
                        {index + 1}. {member.name}
                      </span>
                      <span className="text-muted">{member.role}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-3 border-t border-line pt-3 text-xs text-muted">
                  Kontak darurat: <span className="font-medium text-ink">{detail.emergencyContact.name}</span> •{" "}
                  {detail.emergencyContact.phone}
                </p>
              </Panel>

              <Panel title="Akses Keamanan & RFID Gerbang" aside={`${detail.vehicles.length} Tag Aktif`}>
                <ul className="space-y-3 text-xs">
                  {detail.vehicles.map((vehicle) => (
                    <li key={vehicle.rfid} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink">{vehicle.name}</p>
                        <p className="text-muted">
                          {vehicle.label} • {vehicle.plate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted">{vehicle.rfid}</p>
                        <p className="font-semibold text-emerald-700">• Aktif</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>

              <div className="md:col-span-2">
                <Panel title="Status Iuran Pengelolaan Lingkungan (IPL)" aside={`Lunas ${detail.ipl.period}`}>
                  <div className="grid gap-4 text-xs sm:grid-cols-3">
                    <div>
                      <p className="text-muted">Periode Berjalan • Terverifikasi</p>
                      <p className="mt-1 text-xl font-bold text-ink">{formatRupiah(detail.ipl.amountPaid)}</p>
                      <p className="text-muted">Metode: {detail.ipl.method}</p>
                    </div>
                    <div>
                      <p className="mb-1 font-semibold text-ink">Komponen iuran tercover</p>
                      <ul className="space-y-1 text-muted">
                        {detail.ipl.components.map((component) => (
                          <li key={component.label}>
                            {component.label} ({formatRupiah(component.amount)})
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-ink">Rangkuman kepatuhan</p>
                      <p className="text-muted">{detail.ipl.compliance}</p>
                      <p className="text-muted">Tunggakan tertunda: {formatRupiah(detail.ipl.arrears)}</p>
                      <p className="text-muted">Tagihan berikutnya: {detail.ipl.nextBill}</p>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
