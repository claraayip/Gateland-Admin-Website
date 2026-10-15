type ClassValue = string | false | null | undefined;

/** Menggabungkan class secara kondisional, mis. cn("a", isActive && "b"). */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
