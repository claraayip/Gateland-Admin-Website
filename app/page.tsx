import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Login Admin" };

/** Landing page / login. Berada di luar route group (admin) sehingga tanpa Sidebar. */
export default function LoginPage() {
  return (
    <main className="grid min-h-screen w-full grid-cols-1 bg-white font-display lg:grid-cols-12">
      {/* ===== Panel merek (kiri) ===== */}
      <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-8 text-white sm:p-12 lg:col-span-5 lg:p-16 xl:col-span-6">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 mx-auto my-auto max-w-lg lg:mx-0">
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-3 shadow-lg backdrop-blur-md sm:size-20">
            <Image
              src="/assets/logo-gateland.png"
              alt="Logo GateLand"
              width={80}
              height={80}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <div className="mb-6">
            <span className="block text-3xl font-extrabold tracking-tight sm:text-4xl">GateLand</span>
            <small className="text-sm font-medium tracking-wide text-indigo-200">Smart Living Starts Here</small>
          </div>

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-indigo-100 backdrop-blur-md">
            <span className="size-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
            RT 04 / RW 08 Sekar Indah
          </div>

          <h1 className="mb-4 text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl">
            Platform Manajemen Perumahan Terintegrasi
          </h1>
          <p className="text-sm leading-relaxed text-indigo-100/80 sm:text-base">
            Solusi praktis untuk keterbukaan laporan keuangan, otomatisasi catatan iuran warga, dan koordinasi
            lingkungan yang lebih teratur.
          </p>
        </div>

        <p className="relative z-10 mt-8 hidden border-t border-white/10 pt-8 text-xs text-indigo-200/60 lg:block">
          &copy; GateLand System. All rights reserved.
        </p>
      </section>

      {/* ===== Panel form (kanan) ===== */}
      <section className="flex items-center justify-center bg-slate-50 p-6 sm:p-12 lg:col-span-7 lg:p-16 xl:col-span-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <span className="font-bold text-indigo-500" aria-hidden="true">
              ◈
            </span>
            Portal Resmi Pengurus &amp; Operator
          </div>

          <h2 className="mb-2 text-2xl font-bold text-slate-900">Masuk ke Akun Admin</h2>
          <p className="mb-8 text-sm leading-relaxed text-slate-500">
            Gunakan kredensial pengelola resmi Anda untuk mengelola kas, perizinan, dan informasi lingkungan klaster.
          </p>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}