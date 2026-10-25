'use server'

import { iuranSchema } from "@/lib/schemas/iuran";
import { addIuranPost } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type FormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createIuranAction(
  prevState: FormState, 
  formData: FormData
): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());
  
  const result = iuranSchema.safeParse(rawData);

  if (!result.success) {
    const { fieldErrors } = result.error.flatten();
    return { errors: fieldErrors };
  }

  addIuranPost({
    namaIuran: result.data.namaIuran,
    nominal: result.data.nominal,
    tipe_iuran: result.data.tipe_iuran,
    uraian: result.data.uraian,
    jatuhTempoTanggal: result.data.jatuhTempoTanggal,
    sasaran: result.data.sasaran,
    selectedBlocks: result.data.selectedBlocks,
    frekuensiType: result.data.frekuensiType,
  });

  revalidatePath("/iuran");
  redirect("/iuran");
}