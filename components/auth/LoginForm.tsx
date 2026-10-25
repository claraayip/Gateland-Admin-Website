"use client";

import { useState, useEffect, type ChangeEvent, type KeyboardEvent } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";
import { authApi } from "@/lib/api";

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
    <div
      onKeyDown={handleKeyDown}
      className="w-full"
      style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Badge Atas Form */}
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#EFF2FE] px-3.5 py-1 text-xs font-semibold text-[#3B4CA8]">
        <ShieldCheck className="size-3.5 text-[#3B4CA8]" />
        <span>Portal Resmi Pengurus &amp; Operator</span>
      </div>

      {/* Judul & Subtitle */}
      <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight mb-2">
        Masuk ke Akun Admin
      </h2>
      <p className="text-xs text-slate-500 leading-relaxed mb-6">
        Gunakan kredensial pengelola resmi Anda untuk mengelola kas, perizinan, dan gerbang klaster.
      </p>

      {/* Pesan Kesalahan */}
      {errorMessage && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Pesan Sukses */}
      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Input Email */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
          Email Pengelola / Admin
        </label>
        <div className="relative flex items-center">
          <Mail className="pointer-events-none absolute left-3.5 size-4 text-slate-400" />
          <input
            type="text"
            value={emailValue}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            placeholder="admin.harmoni@gateland.id"
            autoComplete="email"
            className="w-full rounded-xl bg-[#F1F3FD] border-0 pl-10 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400/80 focus:outline-none focus:ring-2 focus:ring-[#050C9C]/20 transition"
          />
        </div>
        {emailError && (
          <p className="mt-1 text-xs font-medium text-rose-600">{emailError}</p>
        )}
      </div>

      {/* Input Kata Sandi */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
          Kata Sandi
        </label>
        <div className="relative flex items-center">
          <Lock className="pointer-events-none absolute left-3.5 size-4 text-slate-400" />
          <input
            type={showPassword ? "text" : "password"}
            value={passwordValue}
            onChange={(e) => {
              setPasswordValue(e.target.value);
              setPasswordError(null);
              setErrorMessage(null);
            }}
            placeholder="••••••••••••"
            autoComplete="current-password"
            className="w-full rounded-xl bg-[#F1F3FD] border-0 pl-10 pr-10 py-3 text-sm text-slate-800 placeholder:text-slate-400/80 focus:outline-none focus:ring-2 focus:ring-[#050C9C]/20 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {passwordError && (
          <p className="mt-1 text-xs font-medium text-rose-600">{passwordError}</p>
        )}
      </div>

      {/* Tombol Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#050C9C] hover:bg-[#040878] active:bg-[#030660] py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition duration-150 disabled:opacity-60 cursor-pointer"
      >
        <span>{isLoading ? "Memproses..." : "Masuk ke Dashboard Admin"}</span>
        {!isLoading && <ArrowRight className="size-4" />}
      </button>
    </div>
  );
}
