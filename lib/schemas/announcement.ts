import { z } from "zod";

export const announcementSchema = z.object({
  judul: z
    .string()
    .min(3, "Judul pengumuman minimal 3 karakter")
    .max(120, "Maksimal 120 karakter"),
  kategori: z.enum(["kegiatan", "perbaikan", "keamanan", "iuran", "umum"]),
  urgensi: z.enum(["biasa", "agenda", "penting", "darurat"]),
  isi: z.string().min(10, "Isi pengumuman minimal 10 karakter"),
  lokasi: z.string().optional(),
  tanggal: z.string().optional(),
  jam: z.string().optional(),
  target_warga: z.string().optional(),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;