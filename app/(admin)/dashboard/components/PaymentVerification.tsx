"use client";

import { useState } from "react";
import { ArrowRight, ClipboardCheck, MapPin, Receipt } from "lucide-react";
import type { PendingPayment } from "@/lib/types";

export type Decision = "approved" | "rejected";

interface PaymentVerificationProps {
  payments: PendingPayment[];
  detailed: boolean;
  onToggleDetailed: () => void;
  onDecision: (id: string, decision: Decision) => void;
}

type FilterKey = "perlu-tindakan" | "semua" | "lunas" | "tunggakan";

export function PaymentVerification({
  payments,
  detailed,
  onToggleDetailed,
}: PaymentVerificationProps) {
  const [filter, setFilter] = useState<FilterKey>("perlu-tindakan");

  // Di tampilan overview ringkasan sesuai screenshot, tampilkan 2 baris
  const rows = payments.slice(0, 2);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#EFF2FD] text-slate-800">
            <ClipboardCheck className="size-5 text-slate-800" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Verifikasi Pembayaran Iuran
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Konfirmasi bukti transfer masuk dari warga sebelum kwitansi digital diterbitkan
            </p>
          </div>
        </div>

        {/* Filter Tabs (Single Segmented Capsule Bar) */}
        <div className="bg-[#EFF2FD] rounded-xl p-1 flex items-center">
          <button
            type="button"
            onClick={() => setFilter("perlu-tindakan")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              filter === "perlu-tindakan"
                ? "bg-[#050C9C] text-white shadow-xs"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            <span>Perlu Tindakan</span>
            <span className="bg-[#F8B6A8] text-[#5C1D18] size-5 rounded-full flex items-center justify-center font-bold text-[11px]">
              4
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter("semua")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
              filter === "semua"
                ? "bg-[#050C9C] text-white shadow-xs"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            Semua (150)
          </button>

          <button
            type="button"
            onClick={() => setFilter("lunas")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
              filter === "lunas"
                ? "bg-[#050C9C] text-white shadow-xs"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            Lunas
          </button>

          <button
            type="button"
            onClick={() => setFilter("tunggakan")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
              filter === "tunggakan"
                ? "bg-[#050C9C] text-white shadow-xs"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            Tunggakan
          </button>
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-y border-slate-100 bg-[#F8F9FE] text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              <th className="px-5 py-3 sm:px-6">PENGHUNI &amp; UNIT</th>
              <th className="px-4 py-3">POS IURAN</th>
              <th className="px-4 py-3">NOMINAL</th>
              <th className="px-5 py-3 sm:px-6">KANAL &amp; BUKTI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50/60 transition">
                {/* Penghuni & Unit */}
                <td className="px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="size-10 shrink-0 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-bold flex items-center justify-center text-xs">
                      {payment.residentName.includes("Azizah") ? "AZ" : "HK"}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-[13px]">{payment.residentName}</p>
                      <p className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="size-3 text-slate-400" />
                        <span>{payment.unit}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">September 2026</p>
                    </div>
                  </div>
                </td>

                {/* Pos Iuran */}
                <td className="px-4 py-4">
                  <span className="inline-flex rounded-full bg-[#EEF2FF] px-3.5 py-1.5 text-[11px] font-semibold text-[#4338CA]">
                    {payment.postName}
                  </span>
                </td>

                {/* Nominal */}
                <td className="px-4 py-4">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {payment.amount === 175000 ? "Rp 175.000" : "Rp 200.000"}
                  </span>
                </td>

                {/* Kanal & Bukti */}
                <td className="px-5 py-4 sm:px-6">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2.5 rounded-xl bg-[#EFF2FD] hover:bg-[#E4E8FB] px-3 py-2 text-xs font-semibold text-slate-900 transition cursor-pointer"
                  >
                    <Receipt className="size-4 text-[#050C9C]" />
                    <div className="text-left leading-tight">
                      <p className="font-bold text-slate-900 text-xs">{payment.channel}</p>
                      <p className="text-[10px] font-normal text-slate-500">Klik pratinjau</p>
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 bg-slate-50/40">
        <span className="text-slate-500 text-[11px] sm:text-xs">
          Menampilkan 4 pembayaran yang membutuhkan validasi manual bendahara
        </span>
        <button
          type="button"
          onClick={onToggleDetailed}
          className="inline-flex items-center gap-1.5 font-bold text-[#050C9C] hover:underline cursor-pointer text-xs"
        >
          <span>Buka Riwayat Lengkap Seluruh Iuran</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
