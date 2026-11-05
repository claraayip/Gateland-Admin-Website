"use client";

import { useState, useActionState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginAdminAction } from "@/app/(admin)/login/action";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Bersihkan query string (?email=...&password=...) dari address bar jika ada sisa submit sebelumnya
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // ─── Format email helper ───────────────────────────────────
  function formatEmail(input: string): string {
    let clean = input.trim();
    if (!clean) return "";
    if (!clean.includes("@")) {
      return `${clean}@gmail.com`;
    }
    if (clean.endsWith("@")) {
      return `${clean}gmail.com`;
    }
    return clean;
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setEmailValue(val);
    setEmailError(null);
    setErrorMessage(null);
  }

  function handleEmailBlur() {
    if (emailValue.trim()) {
      const formatted = formatEmail(emailValue);
      setEmailValue(formatted);
    }
  }

  // ─── Handle Submit ─────────────────────────────────────────
  async function handleSubmit() {
    setErrorMessage(null);
    setEmailError(null);
    setPasswordError(null);

    // Format & validasi email
    const finalEmail = formatEmail(emailValue);
    setEmailValue(finalEmail);

    if (!finalEmail) {
      setEmailError("Email wajib diisi.");
      return;
    }
    if (!finalEmail.endsWith("@gmail.com")) {
      setEmailError("Email wajib menggunakan @gmail.com");
      return;
    }

    const password = passwordValue.trim();
    if (!password) {
      setPasswordError("Kata sandi wajib diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login(finalEmail, password);
      
      if (response.data?.token) {
        document.cookie = `gateland_token=${response.data.token}; path=/; max-age=604800; SameSite=Lax`;
        localStorage.setItem("gateland_token", response.data.token);
        if (response.data.user) {
          localStorage.setItem("gateland_user", JSON.stringify(response.data.user));
        }
      }

      setSuccessMessage("Login berhasil! Mengalihkan ke dashboard...");

      // Redirect ke dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 300);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Gagal masuk. Periksa kembali email dan kata sandi Anda."
      );
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* ─── Notifikasi Error dari Server / Autentikasi ─── */}
      {state?.message && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600">
          {state.message}
        </div>
      )}

      {/* ─── Field: Email Pengelola / Admin ─── */}
      <div>
        <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-800 mb-1.5">
          Email Pengelola / Admin
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Mail className="size-5" aria-hidden="true" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="admin.harmoni@gateland.id"
            autoComplete="email"
            className="w-full rounded-xl border border-transparent bg-[#F3F4FD] py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400/80 transition-colors focus:border-[#090877] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#090877]/20"
          />
        </div>
        {state?.errors?.email && (
          <p className="mt-1.5 text-xs font-semibold text-red-500">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      {/* ─── Field: Kata Sandi ─── */}
      <div>
        <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-slate-800 mb-1.5">
          Kata Sandi
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Lock className="size-5" aria-hidden="true" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            autoComplete="current-password"
            className="w-full rounded-xl border border-transparent bg-[#F3F4FD] py-3.5 pl-11 pr-11 text-sm text-slate-800 placeholder:text-slate-400/80 transition-colors focus:border-[#090877] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#090877]/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600 cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="size-5" aria-hidden="true" />
            ) : (
              <Eye className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
        {state?.errors?.password && (
          <p className="mt-1.5 text-xs font-semibold text-red-500">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      {/* ─── Tombol Submit Masuk Dashboard ─── */}
      <button
        type="submit"
        disabled={isPending}
        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#06076B] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#06076B]/20 transition-all duration-200 hover:bg-[#080980] active:bg-[#040552] disabled:opacity-50"
      >
        <span>{isLoading ? "Memproses..." : "Masuk ke Dashboard Admin"}</span>
        {!isLoading && <ArrowRight className="size-4" />}
      </button>
    </div>
  );
}
