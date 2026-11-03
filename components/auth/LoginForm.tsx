"use client";

import { useState, useActionState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginAdminAction } from "@/app/(admin)/login/action";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, {});
  const [showPassword, setShowPassword] = useState(false);

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
        <span>{isPending ? "Memeriksa Kredensial..." : "Masuk ke Dashboard Admin"}</span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}