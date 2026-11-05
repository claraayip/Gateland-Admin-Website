import { apiFetch } from "@/lib/api";
import { residents, residentTotals } from "@/lib/data";
import type { Resident } from "@/lib/types";

export interface PenghuniPageData {
  residents: Resident[];
  totalAll: number;
}

interface BackendUser {
  id: number | string;
  name: string;
  role: string;
}

export async function getPenghuniData(): Promise<PenghuniPageData> {
  let list = [...residents];
  let total = residentTotals.all;

  try {
    // Ambil daftar pengguna dari backend (/api/users)
    const res = await apiFetch<BackendUser[]>("/api/users");
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      // Map user dari database MySQL ke struktur Resident
      const backendResidents: Resident[] = res.data.map((u, idx) => {
        const blokNumber = `A${(idx % 4) + 1}`;
        const unitNumber = String((idx % 12) + 1).padStart(2, "0");

        return {
          id: `db-user-${u.id}`,
          name: u.name,
          phone: "0812-9845-1122",
          block: `Blok ${blokNumber}`,
          number: `No. ${unitNumber}`,
          memberCount: 4,
          memberSummary: `Role: ${u.role}`,
          status: "aktif",
          payment: {
            state: "lunas",
            label: "Lunas (Sep 2026)",
          },
        };
      });

      // Gabungkan user nyata dari backend dengan direktori hunian
      list = [...backendResidents, ...residents.filter(r => !backendResidents.some(b => b.name.toLowerCase() === r.name.toLowerCase()))];
      total = Math.max(total, list.length);
    }
  } catch (err) {
    console.warn("Backend offline saat fetch /api/users, fallback ke data lokal:", err);
  }

  return {
    residents: list,
    totalAll: total,
  };
}
