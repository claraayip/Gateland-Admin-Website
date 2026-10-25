'use server'

import { announcementSchema } from "@/lib/schemas/announcement";
import { requireAdmin } from "@/lib/auth/session";
import { addAnnouncement } from "@/lib/data";
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
  try {
    await requireAdmin();
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
  addAnnouncement({
    judul: validData.judul,
    kategori: validData.kategori,
    lokasi: validData.lokasi,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}