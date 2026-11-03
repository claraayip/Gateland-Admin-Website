'use server'

import { loginSchema } from "@/lib/schemas/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function loginAdminAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const rawData = Object.fromEntries(formData.entries());

  const result = loginSchema.safeParse(rawData);

  if (!result.success) {
    const { fieldErrors } = result.error.flatten();
    return { errors: fieldErrors };
  }

  const { email, password } = result.data;

  // Validasi ketat kredensial admin
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok || body.status !== "success") {
      return {
        message: body.message || "Email atau kata sandi salah.",
      };
    }

    // Simpan token ke cookie
    const cookieStore = await cookies();
    if (body.data?.token) {
      cookieStore.set("gateland_token", body.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }
  } catch {
    // Fallback verifikasi lokal jika server backend belum running
    if (email !== "admin@gmail.com" || password !== "Admin123-") {
      return {
        message: "Email atau kata sandi salah.",
      };
    }
  }

  redirect("/dashboard");
}