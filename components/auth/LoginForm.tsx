"use client";

import { useState, useActionState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FormInput } from "@/components/ui/FormInput";
import { loginAdminAction } from "@/app/(admin)/login/action";

const labelStyle = "text-xs font-bold tracking-wider text-slate-700 uppercase";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      {state?.message && (
        <div className="rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-600 border border-red-200">
          {state.message}
        </div>
      )}

      <div>
        <FormInput
          name="email"
          type="email"
          label="Email Pengelola / Admin"
          labelClassName={labelStyle}
          placeholder="admin@gmail.com"
          autoComplete="email"
          required
          leading={<Mail className="size-5" aria-hidden="true" />}
        />
        {state?.errors?.email && (
          <p className="mt-1.5 text-xs font-semibold text-red-500">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      <div>
        <FormInput
          name="password"
          type={showPassword ? "text" : "password"}
          label="Kata Sandi"
          labelClassName={labelStyle}
          placeholder="••••••••••••"
          autoComplete="current-password"
          required
          leading={<Lock className="size-5" aria-hidden="true" />}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              aria-pressed={showPassword}
              className="cursor-pointer rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="size-5" aria-hidden="true" />
              ) : (
                <Eye className="size-5" aria-hidden="true" />
              )}
            </button>
          }
        />
        {state?.errors?.password && (
          <p className="mt-1.5 text-xs font-semibold text-red-500">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-600/40 active:bg-indigo-800 disabled:opacity-50"
      >
        <span>{isPending ? "Memeriksa Kredensial..." : "Masuk ke Dashboard Admin"}</span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}