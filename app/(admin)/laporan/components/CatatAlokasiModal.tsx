"use client";

import { useState, type FormEvent } from "react";
import { 
  X, 
  Wallet, 
  Building2, 
  Coins, 
  QrCode, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  Receipt 
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormInput, FormTextarea } from "@/components/ui/FormInput";
import { FormSection } from "@/components/ui/FormSection";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";

interface CatatAlokasiModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: FormData) => void;
}

type JenisAlokasi = "operasional" | "cadangan";
type SumberKas = "bca" | "petty_cash" | "qris";
type StatusOtorisasi = "sah" | "menunggu_rt";

export function CatatAlokasiModal({ open, onClose, onSubmit }: CatatAlokasiModalProps) {
  const [jenisAlokasi, setJenisAlokasi] = useState<JenisAlokasi>("operasional");
  const [nominal, setNominal] = useState<number>(1250000);
  const [sumberKas, setSumberKas] = useState<SumberKas>("bca");
  const [statusOtorisasi, setStatusOtorisasi] = useState<StatusOtorisasi>("sah");

  // Handler Preset Tambah Cepat Nominal
  const handleAddNominal = (value: number) => {
    setNominal((prev) => prev + value);
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("jenisAlokasi", jenisAlokasi);
    formData.append("sumberKas", sumberKas);
    formData.append("statusOtorisasi", statusOtorisasi);
    formData.append("nominal", nominal.toString());
    
    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Catat Alokasi & Kas Keluar"
      badge={<Badge tone="indigo">Buku Kas RT 04 • September 2026</Badge>}
      description="Pencatatan mutasi kas paguyuban, bukti nota kuitansi, dan alokasi anggaran operasional klaster."
      icon={<Wallet className="size-5 text-indigo-300" aria-hidden="true" />}
      footer={
        <div className="flex w-full items-center justify-between sm:justify-end gap-3">
          <Button variant="outline" onClick={onClose} type="button">
            Batal
          </Button>
          <Button 
            type="submit" 
            form="form-catat-alokasi"
            className="bg-indigo-950 hover:bg-indigo-900 text-white font-medium text-xs px-5 py-2.5 rounded-xl"
          >
            Simpan dan Tambahkan Pengeluaran
          </Button>
        </div>
      }
    >
      <form id="form-catat-alokasi" onSubmit={handleSubmit} className="space-y-5 text-xs text-ink">
        
        {/* BAGIAN A • INFORMASI BUKTI & WAKTU TRANSAKSI */}
        <FormSection
          variant="plain"
          marker="A"
          title="INFORMASI BUKTI & WAKTU TRANSAKSI"
          aside={<span className="font-mono text-[11px] text-muted">ID Sinkron: #LOG-2609</span>}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <FormInput
                name="noBukti"
                label="Nomor Bukti / Kuitansi"
                defaultValue="# KWT/2026/09/OUT-043"
                readOnly
                labelTrailing={<Badge tone="green">Otomatis</Badge>}
              />
            </div>
            <div>
              <FormInput
                name="tanggalTransaksi"
                type="text"
                label="Tanggal Transaksi"
                defaultValue="26 September 2026"
                required
              />
            </div>
            <div>
              <FormInput
                name="waktuTransaksi"
                type="text"
                label="Waktu"
                defaultValue="10:30 WIB"
                required
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="font-semibold text-ink">Jenis Alokasi Pengeluaran</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setJenisAlokasi("operasional")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 font-semibold border transition-all cursor-pointer text-xs",
                  jenisAlokasi === "operasional"
                    ? "bg-indigo-950 text-white border-indigo-950 shadow-sm"
                    : "bg-slate-50 text-muted border-line hover:bg-slate-100"
                )}
              >
                <Receipt className="size-4" />
                Pengeluaran / Beban Operasional
              </button>
              <button
                type="button"
                onClick={() => setJenisAlokasi("cadangan")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 font-semibold border transition-all cursor-pointer text-xs",
                  jenisAlokasi === "cadangan"
                    ? "bg-indigo-950 text-white border-indigo-950 shadow-sm"
                    : "bg-slate-50 text-muted border-line hover:bg-slate-100"
                )}
              >
                <Building2 className="size-4" />
                Alokasi Dana Khusus / Cadangan
              </button>
            </div>
          </div>
        </FormSection>

        {/* BAGIAN B • POS ANGGARAN & NOMINAL REALISASI */}
        <FormSection
          variant="plain"
          marker="B"
          title="POS ANGGARAN & NOMINAL REALISASI"
          aside={
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 text-[11px]">
              <CheckCircle2 className="size-3" /> Sisa Plafon Pos: Rp 7.550.000 (Aman)
            </span>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 items-start">
            <div className="space-y-1.5">
              <label className="font-semibold text-ink">Kategori & Pos Anggaran Klaster</label>
              <select
                name="posAnggaran"
                defaultValue="pju"
                className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-xs font-semibold text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="pju">Listrik PJU & Pompa Air Fasum</option>
                <option value="satpam">Honor Satpam & Pos Keamanan</option>
                <option value="sampah">Retribusi Kebersihan & DLH</option>
                <option value="taman">Perawatan Taman & Kas Sosial</option>
              </select>
              
              {/* Tambah Cepat Nominal */}
              <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                <span className="text-[11px] text-muted">Tambah Cepat:</span>
                {[
                  { label: "+ Rp 100 rb", val: 100000 },
                  { label: "+ Rp 500 rb", val: 500000 },
                  { label: "+ Rp 1 jt", val: 1000000 },
                  { label: "+ Rp 5 jt", val: 5000000 },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddNominal(item.val)}
                    className="rounded-lg border border-line bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-ink">Nominal Kas Keluar</label>
                <span className="text-[11px] text-muted">Rupiah (IDR)</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-extrabold text-indigo-950">
                  Rp
                </span>
                <input
                  type="text"
                  name="nominalInput"
                  value={nominal ? nominal.toLocaleString("id-ID") : ""}
                  onChange={(e) => setNominal(Number(e.target.value.replace(/\D/g, "")))}
                  className="w-full rounded-xl border border-line bg-indigo-50/40 py-2.5 pl-10 pr-4 text-base font-extrabold text-indigo-950 focus:border-primary focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* BAGIAN C • SUMBER DANA KAS & VERIFIKASI */}
        <FormSection
          variant="plain"
          marker="C"
          title="SUMBER DANA KAS & VERIFIKASI"
        >
          <div className="space-y-3">
            <label className="font-semibold text-ink block">Pilih Rekening Sumber Kas</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "bca",
                  title: "BCA Kas RT",
                  sub: "827-019-4821",
                  saldo: "Rp 46.470.000",
                  icon: Building2,
                },
                {
                  id: "petty_cash",
                  title: "Kas Kecil Tunai",
                  sub: "Petty Cash RT 04",
                  saldo: "Rp 2.450.000",
                  icon: Coins,
                },
                {
                  id: "qris",
                  title: "QRIS Settlement",
                  sub: "Penampungan Iuran",
                  saldo: "Rp 8.120.000",
                  icon: QrCode,
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = sumberKas === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSumberKas(item.id as SumberKas)}
                    className={cn(
                      "cursor-pointer rounded-xl border p-3.5 transition-all flex flex-col justify-between space-y-2",
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                        : "border-line bg-white hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <p className="font-bold text-ink">{item.title}</p>
                          <p className="text-[10px] text-muted">{item.sub}</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="sumberKasRadio"
                        checked={isSelected}
                        onChange={() => setSumberKas(item.id as SumberKas)}
                        className="size-4 accent-indigo-950"
                      />
                    </div>
                    <p className="text-[11px] font-bold text-emerald-600">
                      Saldo: {item.saldo}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2 items-end">
              <FormInput
                name="penerimaDana"
                label="Pihak Penerima Dana / Vendor / Teknisi"
                defaultValue="Toko Listrik Sinar Terang / Bpk. Slamet"
                required
              />
              
              <div className="space-y-1.5">
                <label className="font-semibold text-ink block">Status Otorisasi Dokumen</label>
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-line">
                  <button
                    type="button"
                    onClick={() => setStatusOtorisasi("sah")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer",
                      statusOtorisasi === "sah"
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-muted hover:text-ink"
                    )}
                  >
                    <CheckCircle2 className="size-3.5 text-emerald-600" /> Sah (Biro Keuangan)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusOtorisasi("menunggu_rt")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer",
                      statusOtorisasi === "menunggu_rt"
                        ? "bg-amber-100 text-amber-800"
                        : "text-muted hover:text-ink"
                    )}
                  >
                    <Clock className="size-3.5 text-amber-600" /> Menunggu Pak RT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        {/* BAGIAN D • URAIAN KEPERLUAN & LAMPIRAN BUKTI */}
        <FormSection
          variant="plain"
          marker="D"
          title="URAIAN KEPERLUAN & LAMPIRAN BUKTI"
        >
          <div className="space-y-4">
            <FormTextarea
              name="uraianPengeluaran"
              label="Uraian Keterangan & Rincian Pengeluaran"
              rows={3}
              defaultValue="Pembelian 2 unit lampu sorot LED 100W pengganti PJU Blok B yang korsleting, kabel instalasi 30m, serta honor teknisi kelistrikan."
              required
            />

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <label className="font-semibold text-ink">Lampiran Bukti Kuitansi / Slip Transfer</label>
                <span className="text-muted">Maksimal 5MB (JPG, PNG, PDF)</span>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <UploadCloud className="size-5" />
                </div>
                <p className="font-bold text-ink text-xs">Bukti Penggunaan Dana</p>
                <p className="text-[10px] text-muted mt-0.5">Klik untuk mengunggah foto nota atau tarik file ke sini</p>
                <input type="file" name="buktiFile" className="hidden" />
              </div>
            </div>
          </div>
        </FormSection>

      </form>
    </Modal>
  );
}