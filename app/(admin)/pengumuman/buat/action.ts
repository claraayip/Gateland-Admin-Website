'use server'

import { announcementSchema } from "@/lib/schemas/announcement";
import { requireAdmin } from "@/lib/auth/session";
import { addAnnouncement } from "@/lib/data";
import { apiFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type FormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createAnnouncementAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  let adminUser;
  try {
    adminUser = await requireAdmin();
  } catch (err) {
    return {
      message: "Gagal: Anda tidak memiliki akses untuk menerbitkan pengumuman.",
    };
  }

  const rawData = Object.fromEntries(formData.entries());
  const result = announcementSchema.safeParse(rawData);

  if (!result.success) {
    const { fieldErrors } = result.error.flatten();
    return { errors: fieldErrors };
  }

  const validData = result.data;

  // 1. Simpan ke backend database API
  try {
    const backendRes = await apiFetch("/api/announcements", {
      method: "POST",
      body: JSON.stringify({
        title: validData.judul,
        category: validData.kategori,
        urgency: validData.urgensi,
        content: validData.isi,
        location: validData.lokasi,
        eventDate: validData.tanggal,
        eventTime: validData.jam,
        targetWarga: validData.target_warga,
        authorName: adminUser?.name || "Admin",
      }),
    });

    if (backendRes.error) {
      console.warn("Backend pengumuman response warning:", backendRes.error);
    }
  } catch (err) {
    console.error("Gagal mengirim pengumuman ke backend:", err);
  }

  // 2. Perbarui in-memory data cache (agar fallback tetap sinkron)
  addAnnouncement({
    judul: validData.judul,
    kategori: validData.kategori,
    lokasi: validData.lokasi,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
