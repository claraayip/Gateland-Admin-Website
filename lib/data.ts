/**
 * Data GateLand terpadu untuk Dashboard, Penghuni, Iuran, dan Laporan.
 */
import type {
  ActivityItem,
  BudgetItem,
  DashboardSummary,
  IuranPost,
  PendingPayment,
  PosRealization,
  Resident,
  Transaction,
} from "./types";

export const currentUser = {
  shortName: "Admin GateLand",
  role: "Pengelola",
  welcomeName: "Admin GateLand",
  location: "Cluster GateLand",
};

/* ======================= DASHBOARD ======================= */

export const dashboardSummary: DashboardSummary = {
  period: "November 2026",
  collected: 0,
  target: 0,
  growthLabel: "Periode berjalan",
  paidUnits: 0,
  totalUnits: 0,
  qrisUnits: 0,
  overdueUnits: 0,
  overdueAmount: 0,
};

export const pendingPayments: PendingPayment[] = [];

export const activities: ActivityItem[] = [];

export const budgetItems: BudgetItem[] = [
  {
    id: "b1",
    name: "Keamanan & Satpam Pos",
    description: "Alokasi operasional keamanan gerbang & patroli",
    amount: 0,
    share: 45,
    tone: "primary",
    statusLabel: "Proyeksi 45% Kas Masuk",
    statusTone: "green",
  },
  {
    id: "b2",
    name: "Kebersihan & Angkut Sampah",
    description: "Retribusi armada sampah & kebersihan lingkungan",
    amount: 0,
    share: 35,
    tone: "secondary",
    statusLabel: "Proyeksi 35% Kas Masuk",
    statusTone: "purple",
  },
  {
    id: "b3",
    name: "Dana Sosial & Perawatan",
    description: "Perawatan fasilitas umum & dana cadangan klaster",
    amount: 0,
    share: 20,
    tone: "rose",
    statusLabel: "Proyeksi 20% Kas Masuk",
    statusTone: "pink",
  },
];

/* ======================= PENGHUNI ======================= */

export const residentTotals = { all: 0 };

export const residents: Resident[] = [];

export const unitOptions = [
  { value: "A1-01", label: "Cluster GateLand - Blok A1 No. 01" },
  { value: "A2-05", label: "Cluster GateLand - Blok A2 No. 05" },
  { value: "B2-09", label: "Cluster GateLand - Blok B2 No. 09" },
  { value: "B6-08", label: "Cluster GateLand - Blok B6 Unit 8" },
  { value: "C1-02", label: "Cluster GateLand - Blok C1 No. 02" },
];

/* ======================= IURAN ======================= */

export const iuranSummary = {
  periodTarget: 0,
  periodCollected: 0,
  totalKK: 0,
};

export const iuranPosts: IuranPost[] = [
  {
    id: "i1", title: "Iuran Kebersihan & Pengangkutan Sampah", icon: "trash", accent: "indigo",
    description: "Pengangkutan rutin oleh petugas kebersihan, perawatan tempat sampah klaster & sanitasi gorong-gorong.",
    badges: [{ label: "Wajib", tone: "indigo" }, { label: "Aktif", tone: "green" }],
    price: 50_000, priceUnit: "/ bulan / penghuni", active: true,
    details: [
      { label: "Sasaran Tagihan", value: "0 Penghuni" },
      { label: "Jatuh Tempo", value: "Sesuai Batas Waktu" },
      { label: "Terkumpul Bln Ini", value: "0 / 0 Penghuni (0%)", positive: false },
      { label: "Metode Bayar", value: "QRIS / Transfer" },
    ],
    actions: [{ label: "Edit Tarif", icon: "edit" }, { label: "Rincian", icon: "eye" }],
  },
  {
    id: "i2", title: "Iuran Keamanan & Portal Barrier Gate 24 Jam", icon: "shield", accent: "indigo",
    description: "Operasional petugas keamanan regu siang & malam serta pemeliharaan kamera CCTV klaster.",
    badges: [{ label: "Wajib Hunian", tone: "indigo" }, { label: "Aktif", tone: "green" }],
    price: 100_000, priceUnit: "/ bulan / unit", active: true,
    details: [
      { label: "Sasaran Tagihan", value: "0 Penghuni" },
      { label: "Jatuh Tempo", value: "Sesuai Batas Waktu" },
      { label: "Terkumpul Bln Ini", value: "0 / 0 Penghuni (0%)", positive: false },
      { label: "Metode Bayar", value: "QRIS / Transfer" },
    ],
    actions: [{ label: "Edit Tarif", icon: "edit" }, { label: "Rincian", icon: "eye" }],
  },
  {
    id: "i3", title: "Iuran Kas & Sosial Paguyuban", icon: "users", accent: "indigo",
    description: "Dana darurat sosial warga, santunan, rapat warga berkala & konsumsi kegiatan lingkungan.",
    badges: [{ label: "Wajib", tone: "indigo" }, { label: "Aktif", tone: "green" }],
    price: 25_000, priceUnit: "/ bulan / penghuni", active: true,
    details: [
      { label: "Sasaran Tagihan", value: "0 Penghuni" },
      { label: "Jatuh Tempo", value: "Sesuai Batas Waktu" },
      { label: "Terkumpul Bln Ini", value: "0 / 0 Penghuni (0%)", positive: false },
      { label: "Kas Cadangan", value: "Rp 0" },
    ],
    actions: [{ label: "Edit Tarif", icon: "edit" }, { label: "Rincian", icon: "eye" }],
  },
];

/* ======================= LAPORAN ======================= */

export const laporanSummary = {
  period: "November 2026",
  cashIn: 0,
  allocations: 0,
  cashBalance: 0,
};

export const allocationBreakdown = [
  {
    id: "al-sample",
    name: "Contoh: Keamanan & Pos Satpam 24 Jam",
    description: "Contoh alokasi beban operasional keamanan gerbang & patroli (belum ada beban kas terealisasi).",
    amount: 0,
  },
];

export const posRealizations: PosRealization[] = [
  {
    id: "x-sample",
    name: "Contoh: Kebersihan & Keamanan Lingkungan",
    tariffLabel: "0 Penghuni (Rp 175rb/penghuni)",
    target: 0,
    collected: 0,
    paidKK: 0,
    totalKK: 0,
    statusLabel: "Contoh Pos (Belum Ada Tagihan)",
    statusTone: "gray",
  },
];

export const transactions: Transaction[] = [
  {
    id: "CONTOH/2026/11/001",
    date: "Contoh • Nov 2026",
    description: "Contoh entri mutasi kas masuk / beban operasional Cluster GateLand",
    post: "Contoh Format Mutasi",
    account: "Kas Cluster GateLand",
    amount: 0,
    verification: "Contoh Data",
  },
];

/* ======================= HELPER MUTASI DATA IURAN ======================= */

export function addIuranPost(newPostData: {
  namaIuran: string;
  nominal: number;
  tipe_iuran: string;
  uraian?: string;
  jatuhTempoTanggal: string;
  sasaran: string;
  selectedBlocks?: string;
  frekuensiType: string;
}) {
  const newId = `i${iuranPosts.length + 1}_${Date.now()}`;
  
  let sasaranText = "Semua Penghuni Terdaftar";
  if (newPostData.sasaran === "dihuni") sasaranText = "Semua Unit Dihuni";
  else if (newPostData.sasaran === "blok" && newPostData.selectedBlocks) {
    try {
      const blocks: string[] = JSON.parse(newPostData.selectedBlocks);
      sasaranText = `Blok ${blocks.join(", ")}`;
    } catch {
      sasaranText = "Pilihan Blok Tertentu";
    }
  }

  // Format tanggal jatuh tempo menjadi ramah baca
  let formattedJatuhTempo = newPostData.jatuhTempoTanggal;
  if (newPostData.jatuhTempoTanggal) {
    const d = new Date(newPostData.jatuhTempoTanggal);
    if (!isNaN(d.getTime())) {
      formattedJatuhTempo = `Tgl ${d.getDate()} (${d.toLocaleDateString("id-ID", { month: "short", year: "numeric" })})`;
    }
  }

  const isWajib = newPostData.tipe_iuran === "wajib_rutin";

  const newPost: IuranPost = {
    id: newId,
    title: newPostData.namaIuran,
    icon: isWajib ? "shield" : "wrench",
    accent: isWajib ? "indigo" : "rose",
    description: newPostData.uraian || "Pos iuran baru diterbitkan oleh Admin.",
    badges: [
      { label: isWajib ? "Wajib" : "Insidental", tone: isWajib ? "indigo" : "rose" },
      { label: "Aktif", tone: "green" },
    ],
    price: newPostData.nominal,
    priceUnit: newPostData.frekuensiType === "sekali" ? "/ Sekali Bayar" : "/ bulan / penghuni",
    active: true,
    details: [
      { label: "Sasaran Tagihan", value: sasaranText },
      { label: "Jatuh Tempo", value: formattedJatuhTempo },
      { label: "Terkumpul Bln Ini", value: "0 Penghuni (0%)", positive: false },
      { label: "Metode Bayar", value: "QRIS / Transfer" },
    ],
    actions: [
      { label: "Edit Tarif", icon: "edit" },
      { label: "Rincian", icon: "eye" },
    ],
  };

  // Tambahkan ke array global iuranPosts di posisi atas
  iuranPosts.unshift(newPost);
}

export function updateIuranPost(
  id: string,
  updates: {
    title?: string;
    description?: string;
    price?: number;
    priceUnit?: string;
    active?: boolean;
  },
) {
  const target = iuranPosts.find((p) => p.id === id);
  if (!target) return null;
  if (updates.title !== undefined) target.title = updates.title;
  if (updates.description !== undefined) target.description = updates.description;
  if (updates.price !== undefined) target.price = updates.price;
  if (updates.priceUnit !== undefined) target.priceUnit = updates.priceUnit;
  if (updates.active !== undefined) {
    target.active = updates.active;
    target.badges = target.badges.map((b) =>
      b.label === "Aktif" || b.label === "Nonaktif"
        ? { label: updates.active ? "Aktif" : "Nonaktif", tone: updates.active ? "green" : "gray" }
        : b,
    );
  }
  return target;
}

/* ======================= DATA & MUTASI PENGUMUMAN ======================= */

export interface AnnouncementItem {
  id: string;
  category: string;
  categoryBadge: string;
  title: string;
  dateMeta: string;
  targetMeta: string;
  readMeta: string;
  badgeTone: "green" | "indigo" | "rose";
  dbId?: number | string;
  content?: string;
  location?: string;
  eventDate?: string;
  eventTime?: string;
  targetWarga?: string;
  authorName?: string;
  urgency?: string;
}

export const announcements: AnnouncementItem[] = [];

export function addAnnouncement(data: { judul: string; kategori: string; lokasi?: string }) {
  const newAnn: AnnouncementItem = {
    id: `ann-${Date.now()}`,
    category: data.kategori.toUpperCase(),
    categoryBadge: "Baru Terbit",
    title: data.judul,
    dateMeta: `Baru saja • oleh Admin`,
    targetMeta: data.lokasi ? `Lokasi: ${data.lokasi}` : "Target: Seluruh Warga GateLand",
    readMeta: "Terkirim ke Warga",
    badgeTone: "indigo",
  };
  announcements.unshift(newAnn);

  // Tambahkan juga ke aktivitas terbaru agar langsung muncul di timeline
  activities.unshift({
    id: `act-${Date.now()}`,
    kind: "announcement",
    title: "Pengumuman Terbit",
    description: `"${data.judul}".`,
    meta: "Baru saja • oleh Admin",
  });
}
