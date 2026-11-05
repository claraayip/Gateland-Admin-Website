'use server'

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function addResidentAction(payload: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password?: string;
  role?: string;
}) {
  try {
    const res = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.password || "password123",
        role: payload.role || "USER",
      }),
      requireAuth: false,
    });

    if (res.error) {
      return { success: false, error: res.error };
    }

    revalidatePath("/penghuni");
    revalidatePath("/dashboard");
    return { success: true, data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menambahkan penghuni baru." };
  }
}

