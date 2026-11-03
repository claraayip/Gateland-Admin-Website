import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Login Admin - GateLand" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen w-full grid-cols-1 bg-white font-sans lg:grid-cols-12">
      {/* ─── Sisi Kiri: Branding & Informasi Cluster (Navy Blue) ─── */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gradient-to-b from-[#090877] via-[#07066C] to-[#040356] px-8 py-12 sm:px-12 sm:py-16 lg:col-span-5 lg:px-14 xl:col-span-6 text-white">
        {/* Subtle Ambient Glow */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-blue-500/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative z-10 mx-auto w-full max-w-md flex flex-col">
          {/* Bagian Atas: Logo Box Putih & Tagline GateLand (Tengah) */}
          <div className="flex flex-col items-center text-center">
            <div className="flex size-56 sm:size-64 items-center justify-center bg-white p-6 shadow-2xl shadow-black/25">
              <Image
                src="/assets/logo-gateland.png"
                alt="Logo GateLand"
                width={180}
                height={180}
                className="h-full w-full object-contain"
                priority
              />
            </div>

            <h2 className="mt-8 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-none">
              GateLand
            </h2>
            <p className="mt-3 text-xs sm:text-sm font-normal tracking-wide text-slate-300">
              Smart Living Starts Here
            </p>
          </div>

          {/* Bagian Bawah: Headline & Deskripsi Sistem (Rata Kiri, dinaikkan agar sejajar & proporsional) */}
          <div className="mt-20 sm:mt-24 text-left">
            <h1 className="text-2xl sm:text-[28px] font-bold leading-snug text-white tracking-tight">
              Sistem Informasi Manajemen<br />Cluster Terpadu
            </h1>
            <p className="mt-3.5 text-xs text-slate-300/80 leading-relaxed max-w-sm sm:max-w-md">
              Platform operasional aman, transparan, dan realtime untuk pengawasan gerbang RFID, iuran berkala, serta pelayanan warga.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Sisi Kanan: Form Login Admin (Clean White) ─── */}
      <section className="flex min-h-screen flex-col justify-center bg-white px-8 py-12 sm:px-12 sm:py-16 lg:col-span-7 lg:px-16 xl:col-span-6">
        <div className="mx-auto w-full max-w-md">
          {/* Badge Portal Resmi */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#F0F2FD] px-3.5 py-1 text-xs font-medium text-[#4F5ED3]">
            <span className="text-xs">🛡️</span>
            <span>Portal Resmi Pengelola</span>
          </div>

          <h2 className="mb-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Masuk ke Akun Admin
          </h2>
          <p className="mb-8 text-xs sm:text-[13px] text-slate-500 leading-relaxed">
            Gunakan kredensial pengelola resmi Anda untuk mengelola kas, perizinan, dan gerbang klaster.
          </p>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}