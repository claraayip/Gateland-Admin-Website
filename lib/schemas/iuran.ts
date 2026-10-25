import { z } from "zod";

export const iuranSchema = z.object({
  namaIuran: z
    .string()
    .min(3, "Nama iuran minimal 3 karakter")
    .max(60, "Maksimal 60 karakter"),
  tipe_iuran: z.enum(["wajib_rutin", "khusus", "insidental", "sukarela", "lainnya"]),
  sasaran: z.enum(["semua", "dihuni", "blok"]),
  selectedBlocks: z.string().optional(),
  scheme: z.enum(["flat", "proporsional"]),
  nominal: z.coerce
    .number({ message: "Nominal harus berupa angka" })
    .min(1000, "Nominal minimal Rp 1.000"),
  uraian: z.string().optional(),
  tampilkanUraian: z.coerce.boolean().optional(),
  qris: z.coerce.boolean().optional(),
  frekuensiType: z.enum(["setiap_bulan", "sekali", "custom"]),
  frekuensiDetail: z.string().optional(),
  jatuhTempoTanggal: z.string().min(1, "Batas jatuh tempo wajib dipilih"),
  mulaiBerlaku: z.string().min(1, "Periode mulai berlaku wajib diisi"),
  pushNotif: z.coerce.boolean().optional(),
  banner: z.coerce.boolean().optional(),
});

export type IuranInput = z.infer<typeof iuranSchema>;