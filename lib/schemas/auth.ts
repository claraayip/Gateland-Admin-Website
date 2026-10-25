import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .refine((val) => val.endsWith("@gmail.com"), {
      message: "Email harus menggunakan domain @gmail.com",
    }),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf kapital")
    .regex(/[0-9]/, "Password harus mengandung minimal 1 angka")
    .regex(/[^a-zA-Z0-9]/, "Password harus mengandung minimal 1 simbol (contoh: @, #, $, !)"),
});

export type LoginInput = z.infer<typeof loginSchema>;