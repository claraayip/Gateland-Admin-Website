"use server";

import { revalidatePath } from "next/cache";
import { updateIuranPost } from "@/lib/data";

export async function updateIuranTarifAction(input: {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  active?: boolean;
}) {
  const cleanTitle = input.title.trim();
  const cleanDesc = input.description.trim();
  const cleanPrice = Number.isFinite(input.price) && input.price >= 0 ? Math.round(input.price) : 0;

  if (!cleanTitle) {
    return { success: false, error: "Nama pos iuran tidak boleh kosong." };
  }

  updateIuranPost(input.id, {
    title: cleanTitle,
    description: cleanDesc,
    price: cleanPrice,
    priceUnit: input.priceUnit.trim() || "/ bulan / penghuni",
    active: input.active,
  });

  revalidatePath("/iuran");
  return { success: true };
}

