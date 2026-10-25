import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Login Admin" };

export default function LoginPage() {
  return (
    <main
      className="min-h-screen w-full bg-white flex p-3 sm:p-5 lg:p-6"
      style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* ===== Panel Merek Biru (Kiri) ===== */}
      <section
        className="hidden lg:flex w-[480px] xl:w-[530px] shrink-0 rounded-[36px] p-10 xl:p-12 flex-col justify-between shadow-2xl relative overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 85% 35%, rgba(46, 92, 255, 0.45) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(20, 45, 200, 0.35) 0%, transparent 55%), linear-gradient(155deg, #050766 0%, #060B7E 35%, #0915A2 65%, #04054C 100%)",
        }}
      >
        {/* Glow efek halus di latar belakang untuk variasi gradasi 3D */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -left-16 size-80 rounded-full bg-blue-500/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -right-24 size-80 -translate-y-1/2 rounded-full bg-indigo-400/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-16 size-80 rounded-full bg-blue-600/20 blur-3xl"
        />

        {/* Bagian Atas: Logo & GateLand */}
        <div className="relative z-10 pt-4">
          {/* Logo Putih */}
          <div className="w-56 h-56 xl:w-60 xl:h-60 mx-auto bg-white rounded-2xl flex items-center justify-center p-7 shadow-2xl mb-8">
            <Image
              src="/assets/logo-gateland.png"
              alt="Logo GateLand"
              width={200}
              height={200}
              className="w-full h-full object-contain"
              priority
            />
          </div>

          {/* Teks GateLand & Slogan Bersih */}
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              GateLand
            </h2>
            <p className="text-xs sm:text-sm font-medium text-white/85 mt-2">
              Smart Living Starts Here
            </p>
          </div>
        </div>

        {/* Bagian Bawah: Informasi Sistem */}
        <div className="relative z-10 pb-2">
          {/* Judul */}
          <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-3">
            Sistem Informasi Manajemen<br />
            Cluster Terpadu
          </h1>

          {/* Deskripsi */}
          <p className="text-xs sm:text-[13px] text-white/75 leading-relaxed max-w-sm">
            Platform operasional aman, transparan, dan realtime untuk pengawasan gerbang RFID, iuran berkala, serta pelayanan warga.
          </p>
        </div>
      </section>

      {/* ===== Panel Form Login (Kanan) ===== */}
      <section className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-[420px]">
          {/* Versi Mobile: Tampilkan logo kecil di atas form jika layar HP */}
          <div className="lg:hidden mb-8 text-center">
            <div className="size-20 mx-auto bg-white rounded-2xl flex items-center justify-center p-3 shadow-md border border-slate-100 mb-3">
              <Image
                src="/assets/logo-gateland.png"
                alt="Logo GateLand"
                width={70}
                height={70}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">GateLand</h2>
            <p className="text-xs text-slate-500">Smart Living Starts Here</p>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}