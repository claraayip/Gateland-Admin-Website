'use server'

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function verifyPaymentAction(id: string, decision: "approved" | "rejected") {
  try {
    const res = await apiFetch(`/api/payments/verify/${id}`, {
      method: "POST",
      body: JSON.stringify({ decision }),
    });

    if (res.error) {
      return { success: false, error: res.error };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memverifikasi pembayaran." };
  }
}

