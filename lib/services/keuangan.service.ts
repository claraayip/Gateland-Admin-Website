import { apiFetch } from "@/lib/api";
import { iuranPosts, formatPeriodNow } from "./keuangan-helpers";
import type { IuranPost, PosRealization, Transaction } from "@/lib/types";

interface BackendUserRow {
  id: number;
  name: string;
  role: string;
}

interface BackendBillRow {
  id: number;
  userId?: number | null;
  residentName: string;
  unit: string;
  month: string;
  amount: number;
  status: "UNPAID" | "PAID" | string;
  dueDate?: string | null;
  createdAt?: string;
}

interface BackendPaymentRow {
  id: string;
  residentName: string;
  unit: string;
  postName: string;
  amount: number;
  channel: string;
  status?: string;
  submittedAgo: string;
  paidAt?: string | null;
}

interface BackendPaymentsResponse {
  data?: BackendPaymentRow[];
  summary?: {
    totalCollected?: number;
    settledCount?: number;
    unpaidCount?: number;
    unpaidAmount?: number;
    paidBillsCount?: number;
    totalBilledAmount?: number;
    totalBillsCount?: number;
  };
}

export interface LiveIuranData {
  period: string;
  registeredResidentsCount: number;
  periodTarget: number;
  periodCollected: number;
  mandatoryPostsCount: number;
  incidentalPostsCount: number;
  hasBills: boolean;
  posts: IuranPost[];
}

export interface LiveLaporanData {
  period: string;
  registeredResidentsCount: number;
  cashIn: number;
  allocations: number;
  cashBalance: number;
  allocationItems: Array<{ id: string; name: string; description: string; amount: number; isExample?: boolean }>;
  realizations: PosRealization[];
  transactions: Transaction[];
}

export async function getLiveIuranData(): Promise<LiveIuranData> {
  const period = formatPeriodNow();
  let registeredResidentsCount = 0;
  let periodTarget = 0;
  let periodCollected = 0;
  let hasBills = false;

  try {
    const [usersRes, paymentsRes, billsRes] = await Promise.all([
      apiFetch<BackendUserRow[]>("/api/users").catch(() => ({ data: [] as BackendUserRow[] })),
      apiFetch<BackendPaymentsResponse>("/api/payments/admin/list", { requireAuth: false }).catch(() => ({ data: undefined })),
      apiFetch<BackendBillRow[]>("/api/payments/bills", { requireAuth: false }).catch(() => ({ data: [] as BackendBillRow[] })),
    ]);

    const users = Array.isArray(usersRes.data)
      ? usersRes.data.filter((u) => String(u.role).toUpperCase() !== "ADMIN")
      : [];
    registeredResidentsCount = users.length;

    const bills = Array.isArray(billsRes.data) ? billsRes.data : [];
    hasBills = bills.length > 0;
    periodTarget = bills.reduce((sum, b) => sum + b.amount, 0);

    const summary = paymentsRes.data?.summary;
    periodCollected = summary?.totalCollected ?? 0;

    const paidCount = bills.filter((b) => b.status === "PAID").length;
    const paidPercent = registeredResidentsCount > 0 && hasBills
      ? Math.round((paidCount / registeredResidentsCount) * 100)
      : 0;

    const posts: IuranPost[] = iuranPosts.map((post) => ({
      ...post,
      priceUnit: post.priceUnit.replace(/KK/gi, "penghuni"),
      details: [
        {
          label: "Sasaran Tagihan",
          value: `${registeredResidentsCount} Penghuni Terdaftar`,
        },
        {
          label: "Jatuh Tempo",
          value: hasBills ? (bills[0]?.dueDate || "Sesuai jadwal tagihan") : "Belum diterbitkan",
        },
        {
          label: "Terkumpul Bln Ini",
          value: hasBills
            ? `${paidCount} / ${registeredResidentsCount} Penghuni (${paidPercent}%)`
            : `0 / ${registeredResidentsCount} Penghuni (0%)`,
          positive: hasBills && paidCount > 0,
        },
        {
          label: "Metode Bayar",
          value: "QRIS / Transfer",
        },
      ],
    }));

    return {
      period,
      registeredResidentsCount,
      periodTarget,
      periodCollected,
      mandatoryPostsCount: hasBills ? posts.filter((p) => p.accent === "indigo").length : 0,
      incidentalPostsCount: hasBills ? posts.filter((p) => p.accent === "rose").length : 0,
      hasBills,
      posts,
    };
  } catch {
    return {
      period,
      registeredResidentsCount,
      periodTarget: 0,
      periodCollected: 0,
      mandatoryPostsCount: 0,
      incidentalPostsCount: 0,
      hasBills: false,
      posts: iuranPosts,
    };
  }
}

export async function getLiveLaporanData(): Promise<LiveLaporanData> {
  const period = formatPeriodNow();
  let registeredResidentsCount = 0;
  let cashIn = 0;
  const allocations = 0;
  let realizations: PosRealization[] = [];
  let transactions: Transaction[] = [];

  try {
    const [usersRes, paymentsRes, billsRes] = await Promise.all([
      apiFetch<BackendUserRow[]>("/api/users").catch(() => ({ data: [] as BackendUserRow[] })),
      apiFetch<BackendPaymentsResponse>("/api/payments/admin/list", { requireAuth: false }).catch(() => ({ data: undefined })),
      apiFetch<BackendBillRow[]>("/api/payments/bills", { requireAuth: false }).catch(() => ({ data: [] as BackendBillRow[] })),
    ]);

    const users = Array.isArray(usersRes.data)
      ? usersRes.data.filter((u) => String(u.role).toUpperCase() !== "ADMIN")
      : [];
    registeredResidentsCount = users.length;

    const bills = Array.isArray(billsRes.data) ? billsRes.data : [];
    const paymentList = Array.isArray(paymentsRes.data?.data) ? paymentsRes.data!.data! : [];
    const settledTx = paymentList.filter((t) => t.status === "SETTLEMENT");
    cashIn = settledTx.reduce((sum, t) => sum + t.amount, 0);

    // Jika ada tagihan riil di DB, tampilkan rekap riil; + tetap sisakan 1 contoh di bawahnya sesuai permintaan
    if (bills.length > 0) {
      const targetSum = bills.reduce((sum, b) => sum + b.amount, 0);
      const paidBills = bills.filter((b) => b.status === "PAID");
      const collectedSum = paidBills.reduce((sum, b) => sum + b.amount, 0);
      const pct = targetSum > 0 ? Math.round((collectedSum / targetSum) * 100) : 0;
      realizations.push({
        id: "real-active",
        name: "Iuran Warga Periode Berjalan",
        tariffLabel: `${bills.length} Tagihan (${registeredResidentsCount} Penghuni)`,
        target: targetSum,
        collected: collectedSum,
        paidKK: paidBills.length,
        totalKK: bills.length,
        statusLabel: `${pct}% Terealisasi`,
        statusTone: pct >= 100 ? "green" : "indigo",
      });
    }

    // Sisakan 1 contoh baris di Rekapitulasi Target vs Realisasi per Pos Iuran
    realizations.push({
      id: "contoh-pos-1",
      name: "Contoh: Iuran Kebersihan & Keamanan Klaster",
      tariffLabel: `${registeredResidentsCount} Penghuni (Rp 175rb/penghuni)`,
      target: 0,
      collected: 0,
      paidKK: 0,
      totalKK: registeredResidentsCount,
      statusLabel: "Contoh Pos (Belum Ada Tagihan)",
      statusTone: "gray",
    });

    // Mutasi kas riil dari transaksi SETTLEMENT + sisakan 1 contoh entri di bawahnya
    const realTransactions: Transaction[] = settledTx.map((t) => ({
      id: t.id,
      date: t.submittedAgo.replace(/^Lunas\s*•\s*/i, ""),
      description: `Pembayaran iuran dari ${t.residentName} (${t.unit})`,
      post: t.postName || "Iuran Warga GateLand",
      account: t.channel,
      amount: t.amount,
      verification: "Lunas Terverifikasi",
    }));

    const exampleTransaction: Transaction = {
      id: "CONTOH/2026/11/001",
      date: "Contoh • Nov 2026",
      description: "Contoh: Penerimaan / alokasi kas operasional Cluster GateLand",
      post: "Contoh Format Mutasi",
      account: "Kas Cluster GateLand",
      amount: 0,
      verification: "Contoh Data",
    };

    transactions = [...realTransactions, exampleTransaction];
  } catch {
    realizations = [
      {
        id: "contoh-pos-1",
        name: "Contoh: Iuran Kebersihan & Keamanan Klaster",
        tariffLabel: "0 Penghuni (Rp 175rb/penghuni)",
        target: 0,
        collected: 0,
        paidKK: 0,
        totalKK: 0,
        statusLabel: "Contoh Pos (Belum Ada Tagihan)",
        statusTone: "gray",
      },
    ];
    transactions = [
      {
        id: "CONTOH/2026/11/001",
        date: "Contoh • Nov 2026",
        description: "Contoh: Penerimaan / alokasi kas operasional Cluster GateLand",
        post: "Contoh Format Mutasi",
        account: "Kas Cluster GateLand",
        amount: 0,
        verification: "Contoh Data",
      },
    ];
  }

  // Sisakan 1 contoh distribusi beban & alokasi sesuai keadaan saat ini
  const allocationItems = [
    {
      id: "contoh-alokasi-1",
      name: "Contoh: Keamanan & Kebersihan Cluster GateLand",
      description: "Contoh format distribusi beban kas bulanan (saat ini belum ada beban kas yang dikeluarkan).",
      amount: 0,
      isExample: true,
    },
  ];

  return {
    period,
    registeredResidentsCount,
    cashIn,
    allocations,
    cashBalance: cashIn - allocations,
    allocationItems,
    realizations,
    transactions,
  };
}

