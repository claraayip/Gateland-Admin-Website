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
    const bodyPayload: Record<string, string> = {
      name: payload.name,
      email: payload.email,
      password: payload.password || "Warga123!",
      role: payload.role || "USER",
    };
    if (payload.phone && payload.phone.trim()) {
      bodyPayload.whatsapp = payload.phone.trim();
    }
    if (payload.address && payload.address.trim()) {
      bodyPayload.address = payload.address.trim();
    }

    const res = await apiFetch<{ user?: { id: number; name: string; email: string; whatsapp?: string | null; address?: string | null; isVerified?: boolean } }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(bodyPayload),
      requireAuth: false,
    });

    if (res.error) {
      return { success: false, error: res.error };
    }

    revalidatePath("/penghuni");
    revalidatePath("/dashboard");
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal menambahkan penghuni baru.";
    return { success: false, error: msg };
  }
}

export async function verifyResidentAction(userId: number, isVerified = true) {
  try {
    const res = await apiFetch(`/api/users/${userId}/verify`, {
      method: "PUT",
      body: JSON.stringify({ isVerified }),
    });

    if (res.error) {
      return { success: false, error: res.error };
    }

    revalidatePath("/penghuni");
    revalidatePath("/dashboard");
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memverifikasi akun warga.";
    return { success: false, error: msg };
  }
}

