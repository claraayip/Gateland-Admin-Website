import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/schemas/auth";
import { LoginForm, type LoginState } from "./components/LoginForm";

export const metadata: Metadata = { title: "Login Admin - GateLand" };

export default function LoginPage() {
  async function loginAdminAction(
    _prevState: LoginState,
    formData: FormData,
  ): Promise<LoginState> {
    "use server";

    const rawData = Object.fromEntries(formData.entries());
    const result = loginSchema.safeParse(rawData);

    if (!result.success) {
      return { errors: result.error.flatten().fieldErrors };
    }

    const { email, password } = result.data;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok || body.status !== "success") {
        return { message: body.message || "Email atau kata sandi salah." };
      }

      if (body.data?.token) {
        const cookieStore = await cookies();
        cookieStore.set("gateland_token", body.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
      }
    } catch {
      // Kredensial lokal hanya digunakan saat backend belum tersedia.
      if (email !== "admin@gmail.com" || password !== "Admin123-") {
        return { message: "Email atau kata sandi salah." };
      }
    }

    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen w-full grid-cols-1 bg-white font-sans lg:grid-cols-12">
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gradient-to-b from-[#090877] via-[#07066C] to-[#040356] px-8 py-12 text-white sm:px-12 sm:py-16 lg:col-span-5 lg:px-14 xl:col-span-6">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-blue-500/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="relative z-10 mx-auto flex w-full max-w-md flex-col">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-56 items-center justify-center bg-white p-6 shadow-2xl shadow-black/25 sm:size-64">
              <Image src="/assets/logo-gateland.png" alt="Logo GateLand" width={180} height={180} className="h-full w-full object-contain" priority />
            </div>
            <h2 className="mt-8 text-4xl font-extrabold leading-none tracking-tight text-white sm:text-5xl">GateLand</h2>
            <p className="mt-3 text-xs font-normal tracking-wide text-slate-300 sm:text-sm">Smart Living Starts Here</p>
          </div>
          <div className="mt-20 text-left sm:mt-24">
            <h1 className="text-2xl font-bold leading-snug tracking-tight text-white sm:text-[28px]">Sistem Informasi Manajemen<br />Cluster Terpadu</h1>
            <p className="mt-3.5 max-w-sm text-xs leading-relaxed text-slate-300/80 sm:max-w-md">Platform operasional aman, transparan, dan realtime untuk pengawasan gerbang RFID, iuran berkala, serta pelayanan warga.</p>
          </div>
        </div>
      </section>
      <section className="flex min-h-screen flex-col justify-center bg-white px-8 py-12 sm:px-12 sm:py-16 lg:col-span-7 lg:px-16 xl:col-span-6">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#F0F2FD] px-3.5 py-1 text-xs font-medium text-[#4F5ED3]"><span>🛡️</span><span>Portal Resmi Pengelola</span></div>
          <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Masuk ke Akun Admin</h2>
          <p className="mb-8 text-xs leading-relaxed text-slate-500 sm:text-[13px]">Gunakan kredensial pengelola resmi Anda untuk mengelola kas, perizinan, dan gerbang klaster.</p>
          <LoginForm action={loginAdminAction} />
        </div>
      </section>
    </main>
  );
}
