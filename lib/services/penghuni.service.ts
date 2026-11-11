import { apiFetch } from "@/lib/api";
import { residents, residentTotals } from "@/lib/data";
import { formatRupiah } from "@/lib/format";
import type { PaymentState, Resident } from "@/lib/types";

export interface PenghuniPageData {
  residents: Resident[];
  totalAll: number;
}

interface BackendPaymentSummary {
  totalBills?: number;
  unpaidCount?: number;
  unpaidAmount?: number;
  paidCount?: number;
  latestPaidMonth?: string | null;
  latestPaidAmount?: number;
  latestMethod?: string | null;
  pendingTransactionCount?: number;
}

interface BackendUser {
  id: number | string;
  name: string;
  email?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  role: string;
  isVerified?: boolean;
  nik?: string | null;
  birthPlaceDate?: string | null;
  residencyStatus?: string | null;
  familyCount?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  rwArea?: string | null;
  occupancyStatus?: string | null;
  ownershipType?: string | null;
  powerWater?: string | null;
  vehicles?: string | null;
  photoUrl?: string | null;
  createdAt?: string;
  paymentSummary?: BackendPaymentSummary;
}

function formatPhoneDisplay(whatsapp?: string | null): string {
  if (!whatsapp || !whatsapp.trim()) return "Belum diisi";
  const digits = whatsapp.replace(/\D/g, "");
  if (digits.startsWith("62") && digits.length >= 9) {
    const local = digits.slice(2);
    const grouped = local.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
    return `+62 ${grouped}`;
  }
  return whatsapp.trim();
}

function parseAddressToBlockUnit(address?: string | null): { block: string; number: string } {
  const clean = (address ?? "").trim();
  if (!clean) {
    return { block: "Belum diisi", number: "Alamat belum dilengkapi" };
  }

  const blokMatch = clean.match(/\bblok\s+([A-Za-z0-9-]+)/i);
  const unitMatch = clean.match(/\b(unit|no\.?|nomor)\s*([A-Za-z0-9-]+)\b/i);

  if (blokMatch && unitMatch) {
    const unitKind = unitMatch[1].toLowerCase().startsWith("unit") ? "Unit" : "No.";
    return {
      block: `Blok ${blokMatch[1].toUpperCase()}`,
      number: `${unitKind} ${unitMatch[2]}`,
    };
  }

  if (blokMatch) {
    return {
      block: `Blok ${blokMatch[1].toUpperCase()}`,
      number: clean.length > blokMatch[0].length ? clean : "Unit Klaster GateLand",
    };
  }

  if (unitMatch) {
    const unitKind = unitMatch[1].toLowerCase().startsWith("unit") ? "Unit" : "No.";
    return {
      block: clean,
      number: `${unitKind} ${unitMatch[2]}`,
    };
  }

  return { block: clean, number: "Klaster GateLand" };
}

function mapPaymentSummary(summary?: BackendPaymentSummary): { state: PaymentState; label: string } {
  if (!summary) {
    return { state: "belum_ada_tagihan", label: "Tagihan Rp 0" };
  }
  if ((summary.pendingTransactionCount ?? 0) > 0) {
    return { state: "menunggu_verifikasi", label: "Menunggu Verifikasi Bayar" };
  }
  if ((summary.unpaidCount ?? 0) > 0) {
    return {
      state: "belum_lunas",
      label: `Belum Lunas (${formatRupiah(summary.unpaidAmount ?? 0)})`,
    };
  }
  if ((summary.paidCount ?? 0) > 0) {
    return {
      state: "lunas",
      label: summary.latestPaidMonth ? `Lunas (${summary.latestPaidMonth})` : "Lunas",
    };
  }
  return { state: "belum_ada_tagihan", label: "Tagihan Rp 0" };
}

export async function getPenghuniData(): Promise<PenghuniPageData> {
  let list = [...residents];
  let total = residentTotals.all;

  try {
    // Ambil daftar pengguna dari backend (/api/users)
    const res = await apiFetch<BackendUser[]>("/api/users");
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      const residentUsers = res.data.filter((u) => String(u.role).toUpperCase() !== "ADMIN");

      // Map user riil dari database MySQL ke struktur Resident
      const backendResidents: Resident[] = residentUsers.map((u) => {
        const dbId = Number(u.id);
        const { block, number } = parseAddressToBlockUnit(u.address);
        const phone = formatPhoneDisplay(u.whatsapp);
        const email = u.email || "-";
        const isVerified = u.isVerified !== false;
        const summary = u.paymentSummary;
        const since = u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "Baru terdaftar";

        const parsedFamilyCount = (() => {
          const match = (u.familyCount ?? "").match(/\d+/);
          if (match) {
            const n = parseInt(match[0], 10);
            if (!Number.isNaN(n) && n > 0) return n;
          }
          return 1;
        })();

        const emergencyName = u.emergencyContactName?.trim() || "Belum diisi";
        const emergencyPhone = u.emergencyContactPhone?.trim() || "Belum diisi";
        const ownershipLabel =
          u.ownershipType?.trim() ||
          u.occupancyStatus?.trim() ||
          (u.role === "GUARD" ? "Petugas Cluster" : "Belum diisi");

        return {
          id: `db-user-${u.id}`,
          dbId: Number.isNaN(dbId) ? undefined : dbId,
          name: u.name,
          email: u.email ?? undefined,
          phone,
          block,
          number,
          memberCount: parsedFamilyCount,
          memberSummary: u.familyCount?.trim() || (u.role === "GUARD" ? "Petugas Keamanan" : "Belum dilengkapi"),
          role: u.role,
          status: isVerified ? "aktif" : "baru_registrasi",
          payment: mapPaymentSummary(summary),
          detail: {
            ownership: ownershipLabel,
            address: u.address?.trim() || `${block} ${number}`,
            email,
            since,
            tenure: isVerified ? "Terverifikasi" : "Menunggu Verifikasi",
            nik: u.nik?.trim() || null,
            birthPlaceDate: u.birthPlaceDate?.trim() || null,
            residencyStatus: u.residencyStatus?.trim() || null,
            familyCount: u.familyCount?.trim() || null,
            rwArea: u.rwArea?.trim() || null,
            occupancyStatus: u.occupancyStatus?.trim() || null,
            powerWater: u.powerWater?.trim() || null,
            vehicleText: u.vehicles?.trim() || null,
            photoUrl: u.photoUrl?.trim() || null,
            members: [
              {
                name: u.name,
                role: u.role === "GUARD" ? "Petugas Keamanan" : (u.occupancyStatus?.trim() || "Pemilik Akun / Warga"),
              },
            ],
            emergencyContact: {
              name: emergencyName,
              phone: emergencyPhone,
            },
            vehicles: [],
            ipl: {
              period: summary?.latestPaidMonth || "Periode Berjalan",
              amountPaid: summary?.latestPaidAmount ?? 0,
              method: summary?.latestMethod || "Belum ada transaksi",
              compliance: (summary?.totalBills ?? 0) === 0
                ? "Belum ada tagihan (Rp 0)"
                : (summary?.unpaidCount ?? 0) > 0
                  ? `${summary?.unpaidCount} tagihan belum dibayar`
                  : "Semua tagihan tercatat lunas",
              components: [],
              arrears: summary?.unpaidAmount ?? 0,
              nextBill: (summary?.totalBills ?? 0) === 0 ? "Menunggu tagihan admin" : "Sesuai jadwal tagihan admin",
            },
          },
        };
      });

      // Tampilkan HANYA user nyata yang sudah registrasi di database MySQL
      list = backendResidents;
      total = backendResidents.length;
    } else {
      list = [];
      total = 0;
    }
  } catch (err) {
    console.warn("Backend offline saat fetch /api/users:", err);
    list = [];
    total = 0;
  }

  return {
    residents: list,
    totalAll: total,
  };
}
