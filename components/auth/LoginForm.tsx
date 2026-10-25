"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FormInput } from "@/components/ui/FormInput";

const labelStyle = "text-xs font-bold tracking-wider text-slate-700 uppercase";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormInput
        name="email"
        type="email"
        label="Email Pengelola / Admin"
        labelClassName={labelStyle}
        placeholder="admin@gateland.com"
        autoComplete="email"
        required
        leading={<Mail className="size-5" aria-hidden="true" />}
      />

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
            {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
          </button>
        }
      />

      <button
        type="submit"
        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-600/40 active:bg-indigo-800"
      >
        <span>Masuk ke Dashboard Admin</span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}
