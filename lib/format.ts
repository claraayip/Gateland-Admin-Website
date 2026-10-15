const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** 7350000 -> "Rp 7.350.000" (spasi biasa agar konsisten di server & browser). */
export function formatRupiah(value: number): string {
  return rupiah.format(value).replace(/\u00a0/g, " ");
}

/** Persentase (1 desimal) dari dua angka, aman terhadap pembagi nol. */
export function percentOf(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 1000) / 10 : 0;
}

const HONORIFICS = new Set(["ibu", "bpk.", "bpk", "bapak"]);

/** "Ibu Alisha Nayara" -> "AN" (gelar sapaan diabaikan). */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => word && !HONORIFICS.has(word.toLowerCase()))
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
