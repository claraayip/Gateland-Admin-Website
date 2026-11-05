'use server'

import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function deleteAnnouncementAction(id: string | number) {
  try {
    const rawId = typeof id === "string" ? id.replace("db-ann-", "") : id;
    const res = await apiFetch(`/api/announcements/${rawId}`, {
      method: "DELETE",
    });

    if (res.error) {
      return { success: false, error: res.error };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menghapus pengumuman." };
  }
}

export async function updateAnnouncementAction(
  id: string | number,
  payload: {
    title: string;
    category: string;
    urgency: string;
    location?: string;
    content: string;
  }
) {
  try {
    const rawId = typeof id === "string" ? id.replace("db-ann-", "") : id;
    const res = await apiFetch(`/api/announcements/${rawId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (res.error) {
      return { success: false, error: res.error };
    }

    revalidatePath("/dashboard");
    return { success: true, data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memperbarui pengumuman." };
  }
}

