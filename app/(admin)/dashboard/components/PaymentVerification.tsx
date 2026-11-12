"use client";

import { useState } from "react";
import { ArrowRight, Check, ClipboardCheck, MapPin, Receipt, X } from "lucide-react";
import { formatRupiah, getInitials } from "@/lib/format";
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
  onDecision,
}: PaymentVerificationProps) {
  const [filter, setFilter] = useState<FilterKey>("semua");

  const pendingList = payments.filter((p) => p.status === "PENDING");
  const settledList = payments.filter((p) => p.status === "SETTLEMENT");
  const overdueList = payments.filter((p) => p.status === "UNPAID");

  const filtered =
    filter === "perlu-tindakan"
      ? pendingList
      : filter === "lunas"
        ? settledList
        : filter === "tunggakan"
          ? overdueList
          : payments;

  const rows = detailed ? filtered : filtered.slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#EFF2FD] text-slate-800">
            <ClipboardCheck className="size-5 text-slate-800" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Verifikasi Pembayaran Iuran
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Konfirmasi bukti transfer atau pembayaran warga terdaftar sebelum kwitansi digital diterbitkan
            </p>
          </div>
        </div>

        {/* Filter Tabs (Single Segmented Capsule Bar - sejajar 1 baris) */}
        <div className="bg-[#EFF2FD] rounded-xl p-1 inline-flex shrink-0 flex-nowrap items-center gap-1 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setFilter("perlu-tindakan")}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              filter === "perlu-tindakan"
                ? "bg-[#050C9C] text-white shadow-xs"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            <span>Perlu Tindakan</span>
            <span className="bg-[#F8B6A8] text-[#5C1D18] min-w-5 px-1.5 h-5 rounded-full flex items-center justify-center font-bold text-[11px]">
              {pendingList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter("semua")}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              filter === "semua"
                ? "bg-[#050C9C] text-white shadow-xs"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            Semua ({payments.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter("lunas")}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              filter === "lunas"
                ? "bg-[#050C9C] text-white shadow-xs"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            Lunas ({settledList.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter("tunggakan")}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              filter === "tunggakan"
                ? "bg-[#050C9C] text-white shadow-xs"
                : "text-slate-700 hover:text-slate-900"
            }`}
          >
            Tunggakan ({overdueList.length})
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
              <th className="px-5 py-3 sm:px-6">KANAL &amp; AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-xs text-slate-500">
                  Belum ada data pembayaran iuran atau tagihan dari warga terdaftar.
                </td>
              </tr>
            ) : (
              rows.map((payment) => {
                const isPending = payment.status === "PENDING";
                return (
                  <tr key={payment.id} className="hover:bg-slate-50/60 transition">
                    {/* Penghuni & Unit */}
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 shrink-0 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-bold flex items-center justify-center text-xs">
                          {getInitials(payment.residentName)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-[13px]">{payment.residentName}</p>
                          <p className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <MapPin className="size-3 text-slate-400" />
                            <span>{payment.unit}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{payment.submittedAgo}</p>
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
                        {formatRupiah(payment.amount)}
                      </span>
                    </td>

                    {/* Kanal & Aksi */}
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-2 rounded-xl bg-[#EFF2FD] px-3 py-2 text-xs font-semibold text-slate-900">
                          <Receipt className="size-4 text-[#050C9C]" />
                          <div className="text-left leading-tight">
                            <p className="font-bold text-slate-900 text-xs">{payment.channel}</p>
                            <p className="text-[10px] font-normal text-slate-500">
                              {payment.status === "SETTLEMENT"
                                ? "Terverifikasi Lunas"
                                : payment.status === "UNPAID"
                                  ? "Belum Dibayar"
                                  : payment.status === "FAILED"
                                    ? "Ditolak"
                                    : "Menunggu Konfirmasi"}
                            </p>
                          </div>
                        </div>

                        {isPending && (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onDecision(payment.id, "approved")}
                              title="Setujui Pembayaran"
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700 cursor-pointer"
                            >
                              <Check className="size-3.5" /> Setujui
                            </button>
                            <button
                              type="button"
                              onClick={() => onDecision(payment.id, "rejected")}
                              title="Tolak Pembayaran"
                              className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100 cursor-pointer"
                            >
                              <X className="size-3.5" /> Tolak
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 bg-slate-50/40">
        <span className="text-slate-500 text-[11px] sm:text-xs">
          Menampilkan {rows.length} dari {filtered.length} transaksi pembayaran warga
        </span>
        <button
          type="button"
          onClick={onToggleDetailed}
          className="inline-flex items-center gap-1.5 font-bold text-[#050C9C] hover:underline cursor-pointer text-xs"
        >
          <span>{detailed ? "Kembali ke Ringkasan Dashboard" : "Buka Riwayat Lengkap Seluruh Iuran"}</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
