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
  shortName: "Bpk. Andi Pratama",
  role: "Pengelola GateLand",
  welcomeName: "Admin GateLand",
  location: "GateLand RT 04 / RW 08",
};

/* ======================= DASHBOARD ======================= */

export const dashboardSummary: DashboardSummary = {
  period: "September 2026",
  collected: 7_350_000,
  target: 9_500_000,
  growthLabel: "+12.4% bln lalu",
  paidUnits: 67,
  totalUnits: 72,
  qrisUnits: 55,
  overdueUnits: 5,
  overdueAmount: 875_000,
};

export const pendingPayments: PendingPayment[] = [
  { id: "p1", residentName: "Ibu Ghaida", unit: "Blok B4 / No. 12", postName: "Iuran Kebersihan dan Keamanan", amount: 175_000, channel: "BCA Transfer", submittedAgo: "10 menit lalu", avatarTone: "blue" },
  { id: "p2", residentName: "Ibu Alisha Nayara", unit: "Blok A2 / No. 05", postName: "Iuran Rutin", amount: 200_000, channel: "BRI Transfer", submittedAgo: "35 menit lalu", avatarTone: "blue" },
  { id: "p3", residentName: "Ibu Shinta Kristy", unit: "Blok C1 / No. 08", postName: "Iuran Kebersihan dan Keamanan", amount: 175_000, channel: "QRIS GateLand", submittedAgo: "1 jam lalu", avatarTone: "blue" },
  { id: "p4", residentName: "Ibu Ratna Kartika", unit: "Blok B2 / No. 14", postName: "Iuran Kebersihan dan Keamanan", amount: 175_000, channel: "BSI Transfer", submittedAgo: "2 jam lalu", avatarTone: "pink" },
  { id: "p5", residentName: "Ibu Azizah Pratama", unit: "Blok B4 / No. 12", postName: "Iuran Kebersihan dan Keamanan", amount: 175_000, channel: "BCA Transfer", submittedAgo: "10 menit lalu", avatarTone: "blue" },
  { id: "p6", residentName: "Ibu Anastasya", unit: "Blok A2 / No. 05", postName: "Iuran Rutin", amount: 200_000, channel: "QRIS GateLand", submittedAgo: "35 menit lalu", avatarTone: "blue" },
  { id: "p7", residentName: "Ibu Eka Putri", unit: "Blok C1 / No. 08", postName: "Iuran Kebersihan dan Keamanan", amount: 175_000, channel: "QRIS GateLand", submittedAgo: "1 jam lalu", avatarTone: "blue" },
];

export const activities: ActivityItem[] = [
  { id: "a1", kind: "approved", title: "Iuran Kas RT Disetujui", description: "Ibu Maya (A1/04) kuitansi resmi otomatis terkirim.", meta: "14:40 WIB • oleh Bpk. Bambang" },
  { id: "a2", kind: "reminder", title: "Pengingat Tagihan Otomatis", description: "WhatsApp bot berhasil menjangkau 8 nomor kepala keluarga.", meta: "11:00 WIB • Sistem GateLand" },
  { id: "a3", kind: "new-resident", title: "Warga Baru Terdaftar", description: "Bpk. Dimas Pratama (Blok D1/02) telah mengaktifkan akun mobile.", meta: "09:15 WIB • Mandiri" },
  { id: "a4", kind: "announcement", title: "Pengumuman Terbit", description: "\"Jadwal Penjemputan Sampah Daur Ulang Setiap Kamis Pagi\"", meta: "Kemarin, 19:30 WIB" },
];

export const budgetItems: BudgetItem[] = [
  { id: "b1", name: "Keamanan & Satpam Pos", description: "Honor 2 personel, shift siang & malam", amount: 7_000_000, share: 45, tone: "primary", statusLabel: "Terbayar Terjadwal (Tgl 25)", statusTone: "green" },
  { id: "b2", name: "Kebersihan & Angkut Sampah", description: "Retribusi armada sampah 3× seminggu & taman RT", amount: 6_000_000, share: 35, tone: "secondary", statusLabel: "Tercukupi Penuh", statusTone: "purple" },
  { id: "b3", name: "Dana Sosial & Perawatan", description: "Lampu jalan, santunan warga, kas cadangan", amount: 2_000_000, share: 20, tone: "rose", statusLabel: "Masuk Kas Abadi", statusTone: "pink" },
];

/* ======================= PENGHUNI ======================= */

export const residentTotals = { all: 72 };

export const residents: Resident[] = [
  {
    id: "r1", name: "Ibu Ghaida", phone: "0812-9845-1122", block: "Blok A2", number: "No. 05",
    memberCount: 4, memberSummary: "Suami, Istri, 2 Anak", status: "aktif",
    payment: { state: "lunas", label: "Lunas (Sep 2026)" },
  },
  {
    id: "r2", name: "Ibu Alisha Nayara", phone: "0812-9845-1122", block: "Blok B3", number: "No. 01",
    memberCount: 4, memberSummary: "Suami, Istri, 2 Anak", status: "aktif",
    payment: { state: "belum_lunas", label: "Belum Lunas (1 Bln)" },
  },
  {
    id: "r3", name: "Ibu Azizah Pratama", phone: "0812-9845-1122", block: "Blok A1", number: "No. 07",
    memberCount: 4, memberSummary: "Suami, Istri, 2 Anak", status: "aktif",
    payment: { state: "lunas", label: "Lunas (Sep 2026)" },
    detail: {
      ownership: "Pemilik Tetap",
      address: "Blok A2 No. 05 • Jl. Gardenia Raya (RT 04 / RW 08)",
      email: "hendra.kusuma@email.com",
      since: "14 Januari 2021",
      tenure: "5+ Thn",
      members: [
        { name: "Bpk. Hendra Kusuma", role: "Kepala Keluarga" },
        { name: "Ibu Azizah Pratama", role: "Istri" },
        { name: "Kevin Kusuma", role: "Anak (Pelajar)" },
        { name: "Alisha Kusuma", role: "Anak (Balita)" },
      ],
      emergencyContact: { name: "Bpk. Hendra Kusuma (Suami)", phone: "0812-9845-9900" },
      vehicles: [
        { name: "Toyota Innova Zenix", label: "Mobil 1", plate: "B 1420 GTL", rfid: "#RFID-0482" },
        { name: "Honda Vario 160", label: "Motor 1", plate: "B 4912 SFD", rfid: "#RFID-0483" },
      ],
      ipl: {
        period: "September 2026",
        amountPaid: 175_000,
        method: "QRIS Otomatis (01 Sep 2026)",
        compliance: "100% On-Time (12 Bulan)",
        components: [
          { label: "Kebersihan & Angkut Sampah", amount: 60_000 },
          { label: "Keamanan Klaster 24 Jam", amount: 90_000 },
          { label: "Kas Sosial & Taman", amount: 25_000 },
        ],
        arrears: 0,
        nextBill: "01 Oktober 2026",
      },
    },
  },
  {
    id: "r4", name: "Ibu Siti Wahyuni", phone: "0812-9845-1122", block: "Blok B2", number: "No. 04",
    memberCount: 4, memberSummary: "Suami, Istri, 2 Anak", status: "aktif",
    payment: { state: "lunas", label: "Lunas (Sep 2026)" },
  },
  {
    id: "r5", name: "Ibu Cathleen", phone: "0812-9845-1122", block: "Blok A2", number: "No. 05",
    memberCount: 4, memberSummary: "Suami, Istri, 2 Anak", status: "baru_registrasi",
    payment: { state: "menunggu_verifikasi", label: "Menunggu Verifikasi" },
  },
];

/** Opsi unit untuk form "Tambah Penghuni" (value: "<blok>-<nomor>"). */
export const unitOptions = [
  { value: "A1-07", label: "Blok A1 No. 07 – Jl. Sekar Indah" },
  { value: "A2-05", label: "Blok A2 No. 05 – Jl. Sekar Indah" },
  { value: "B2-09", label: "Blok B2 No. 09 – Jl. Boulevard Barat" },
  { value: "C1-02", label: "Blok C1 No. 02 – Jl. Gardenia Utama" },
];

/* ======================= IURAN ======================= */

export const iuranSummary = {
  periodTarget: 45_000_000,
  periodCollected: 42_850_000,
  totalKK: 72,
};

export const iuranPosts: IuranPost[] = [
  {
    id: "i1", title: "Iuran Kebersihan & Pengangkutan Sampah", icon: "trash", accent: "indigo",
    description: "Pengangkutan 3x seminggu oleh DLH, perawatan tong sampah klaster & sanitasi gorong-gorong.",
    badges: [{ label: "Wajib", tone: "indigo" }, { label: "Aktif", tone: "green" }],
    price: 50_000, priceUnit: "/ bulan / KK", active: true,
    details: [
      { label: "Sasaran Tagihan", value: "72 KK (Semua)" },
      { label: "Jatuh Tempo", value: "Tgl 10 Tiap Bulan" },
      { label: "Terkumpul Bln Ini", value: "56 / 72 KK (98%)", positive: true },
      { label: "Metode Bayar", value: "QRIS / Transfer" },
    ],
    actions: [{ label: "Edit Tarif", icon: "edit" }, { label: "Rincian", icon: "eye" }],
  },
  {
    id: "i2", title: "Iuran Keamanan & Portal Barrier Gate 24 Jam", icon: "shield", accent: "indigo",
    description: "Gaji 2 personil satpam regu siang & malam dan CCTV.",
    badges: [{ label: "Wajib Hunian", tone: "indigo" }, { label: "Aktif", tone: "green" }],
    price: 100_000, priceUnit: "/ bulan / unit", active: true,
    details: [
      { label: "Sasaran Tagihan", value: "72 Unit Dihuni" },
      { label: "Jatuh Tempo", value: "Tgl 10 Tiap Bulan" },
      { label: "Terkumpul Bln Ini", value: "56 / 72 KK (96%)", positive: true },
      { label: "Metode Bayar", value: "QRIS / Transfer" },
    ],
    actions: [{ label: "Edit Tarif", icon: "edit" }, { label: "Rincian", icon: "eye" }],
  },
  {
    id: "i3", title: "Iuran Kas RT & Sosial Paguyuban", icon: "users", accent: "indigo",
    description: "Dana darurat kemalangan duka warga, santunan sakit, rapat warga berkala & konsumsi kerja bakti.",
    badges: [{ label: "Wajib", tone: "indigo" }, { label: "Aktif", tone: "green" }],
    price: 25_000, priceUnit: "/ bulan / KK", active: true,
    details: [
      { label: "Sasaran Tagihan", value: "72 KK (Semua)" },
      { label: "Jatuh Tempo", value: "Tgl 10 Tiap Bulan" },
      { label: "Terkumpul Bln Ini", value: "56 / 72 KK (94.6%)", positive: true },
      { label: "Kas Cadangan", value: "Rp 34.200.000" },
    ],
    actions: [{ label: "Edit Tarif", icon: "edit" }, { label: "Rincian", icon: "eye" }],
  },
  {
    id: "i4", title: "Perbaikan Paving Blok Sektor Barat", icon: "wrench", accent: "rose",
    description: "Penataan ulang drainase dan perkerasan paving blok ambles di jalan utama Blok B & Blok C.",
    badges: [{ label: "Insidental", tone: "rose" }, { label: "Berjalan", tone: "green" }],
    price: 50_000, priceUnit: "/ Sekali Bayar",
    progress: {
      collected: 3_450_000, target: 3_600_000, paidKK: 126,
      period: "Periode: 1 Agustus - 25 Oktober 2026", unpaidNote: "Sisa 3 KK Belum Transfer",
    },
    actions: [{ label: "Edit Target", icon: "edit" }, { label: "Kirim Pengingat", icon: "bell" }],
  },
];

/* ======================= LAPORAN ======================= */
/*
 * CATATAN: laporan.html di repo masih berisi konflik merge (HEAD vs origin/main).
 * Data di bawah memakai sisi origin/main (angka Rp 42.850.000 & 150 KK, selaras
 * dengan halaman Iuran). Ganti di sini bila versi HEAD yang benar.
 */

export const laporanSummary = {
  period: "September 2026",
  cashIn: 42_850_000,
  allocations: 31_420_000,
  cashBalance: 148_650_000,
};

export const allocationBreakdown = [
  { id: "al1", name: "Keamanan & Pos Satpam 24 Jam", description: "Honor 4 Personil + Servis Boom Gate RFID", amount: 15_000_000 },
  { id: "al2", name: "Kebersihan & Angkut Sampah DLH", description: "Retribusi truk kontainer sampah 3x seminggu", amount: 7_500_000 },
  { id: "al3", name: "Kas Sosial & Rapat Warga", description: "Santunan kedukaan & logistik musyawarah RT", amount: 3_750_000 },
];

export const posRealizations: PosRealization[] = [
  { id: "x1", name: "Kebersihan & Sampah Lingkungan", tariffLabel: "150 KK (Rp 50rb/KK)", target: 7_500_000, collected: 7_500_000, paidKK: 150, totalKK: 150, statusLabel: "100% Tercapai", statusTone: "green" },
  { id: "x2", name: "Keamanan, Sekuriti & Barrier RFID", tariffLabel: "150 KK (Rp 100rb/KK)", target: 15_000_000, collected: 14_400_000, paidKK: 144, totalKK: 150, statusLabel: "96% Berjalan", statusTone: "indigo" },
  { id: "x3", name: "Kas Paguyuban & Kesejahteraan Sosial", tariffLabel: "150 KK (Rp 25rb/KK)", target: 3_750_000, collected: 3_550_000, paidKK: 142, totalKK: 150, statusLabel: "94.6% Tertib", statusTone: "indigo" },
  { id: "x4", name: "Iuran Insidental Kerapihan Paving Lapangan", tariffLabel: "150 KK (Rp 75rb/KK)", target: 11_250_000, collected: 9_450_000, paidKK: 126, totalKK: 150, statusLabel: "84% Insidental", statusTone: "rose" },
];

export const transactions: Transaction[] = [
  { id: "KWT/2026/09/OUT-842", date: "25 Sep 2026, 09:15", description: "Honor Gaji 4 Petugas Satpam Shift Pagi & Malam", post: "Keamanan Lingkungan", account: "BCA Rekening Kas RT", amount: -12_000_000, verification: "Sah (Biro Fin)" },
  { id: "KWT/2026/09/OUT-841", date: "22 Sep 2026, 14:10", description: "Penggantian 6 Unit Lampu LED Sorot PJU Blok B3", post: "Listrik & Fasilitas Umum", account: "Petty Cash Tunai RT", amount: -1_150_000, verification: "Sah (Biro Fin)" },
  { id: "KWT/2026/09/OUT-840", date: "18 Sep 2026, 10:30", description: "Pembayaran Termin 1 Kontrak Truk Sampah DLH", post: "Kebersihan Lingkungan", account: "BCA Rekening Kas RT", amount: -3_750_000, verification: "Sah (Biro Fin)" },
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
  
  let sasaranText = "72 KK (Semua)";
  if (newPostData.sasaran === "dihuni") sasaranText = "72 Unit Dihuni";
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
    priceUnit: newPostData.frekuensiType === "sekali" ? "/ Sekali Bayar" : "/ bulan / KK",
    active: true,
    details: [
      { label: "Sasaran Tagihan", value: sasaranText },
      { label: "Jatuh Tempo", value: formattedJatuhTempo },
      { label: "Terkumpul Bln Ini", value: "0 / 72 KK (0%)", positive: false },
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
}

export const announcements: AnnouncementItem[] = [
  {
    id: "ann-1",
    category: "Kebersihan & Lingkungan",
    categoryBadge: "Aktif / Terbit",
    title: "Jadwal Penjemputan Sampah Daur Ulang Setiap Kamis Pagi",
    dateMeta: "Kemarin, 19:30 WIB • oleh Bpk. Bambang",
    targetMeta: "Target: Semua Warga (72 KK)",
    readMeta: "Dibaca 68 warga",
    badgeTone: "green",
  },
  {
    id: "ann-2",
    category: "Agenda Warga",
    categoryBadge: "Tersemat / Pinned",
    title: "Kerja Bakti Lingkungan & Pengecatan Gapura Klaster",
    dateMeta: "Minggu, 15 Ags 2026 • 07:00 WIB",
    targetMeta: "Area Gapura Utama & Pos Satpam",
    readMeta: "Dibaca 72 warga",
    badgeTone: "indigo",
  },
  {
    id: "ann-3",
    category: "Keuangan & Iuran",
    categoryBadge: "Jatuh Tempo: 10 September",
    title: "Pengingat Pembayaran Iuran Bulan September 2026",
    dateMeta: "Diterbitkan: 1 Sep 2026 • Sistem GateLand",
    targetMeta: "142 dari 150 KK telah membayar",
    readMeta: "Dibaca 70 warga",
    badgeTone: "rose",
  },
];

export function addAnnouncement(data: { judul: string; kategori: string; lokasi?: string }) {
  const newAnn: AnnouncementItem = {
    id: `ann-${Date.now()}`,
    category: data.kategori.toUpperCase(),
    categoryBadge: "Baru Terbit",
    title: data.judul,
    dateMeta: `Baru saja • oleh Admin`,
    targetMeta: data.lokasi ? `Lokasi: ${data.lokasi}` : "Target: Seluruh Warga RT 04",
    readMeta: "Dibaca 1 warga",
    badgeTone: "indigo",
  };
  announcements.unshift(newAnn);
}