/* ---------- Umum ---------- */
export type BadgeTone = "indigo" | "green" | "rose" | "pink" | "red" | "darkred" | "purple" | "gray";
export type AvatarTone = "navy" | "blue" | "purple" | "pink";

/* ---------- Dashboard ---------- */
export type PaymentChannel = "BCA Transfer" | "BRI Transfer" | "BSI Transfer" | "QRIS GateLand";

export interface DashboardSummary {
  period: string;
  collected: number;
  target: number;
  growthLabel: string;
  paidUnits: number;
  totalUnits: number;
  qrisUnits: number;
  overdueUnits: number;
  overdueAmount: number;
}

export interface PendingPayment {
  id: string;
  residentName: string;
  unit: string;
  postName: string;
  amount: number;
  channel: PaymentChannel;
  submittedAgo: string;
  avatarTone: AvatarTone;
}

export type ActivityKind = "approved" | "reminder" | "new-resident" | "announcement";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  description: string;
  meta: string;
}

export type BudgetTone = "primary" | "secondary" | "rose";

export interface BudgetItem {
  id: string;
  name: string;
  description: string;
  amount: number;
  share: number; // persen
  tone: BudgetTone;
  statusLabel: string;
  statusTone: BadgeTone;
}

/* ---------- Penghuni ---------- */
export type ResidentStatus = "aktif" | "baru_registrasi";
export type PaymentState = "lunas" | "belum_lunas" | "menunggu_verifikasi";

export interface ResidentDetail {
  ownership: string;
  address: string;
  email: string;
  since: string;
  tenure: string;
  members: { name: string; role: string }[];
  emergencyContact: { name: string; phone: string };
  vehicles: { name: string; label: string; plate: string; rfid: string }[];
  ipl: {
    period: string;
    amountPaid: number;
    method: string;
    compliance: string;
    components: { label: string; amount: number }[];
    arrears: number;
    nextBill: string;
  };
}

export interface Resident {
  id: string;
  name: string;
  phone: string;
  block: string; // "Blok A2"
  number: string; // "No. 05"
  memberCount: number;
  memberSummary: string;
  status: ResidentStatus;
  payment: { state: PaymentState; label: string };
  detail?: ResidentDetail; // belum tersedia untuk semua warga
}

/* ---------- Iuran ---------- */
export type IuranIcon = "trash" | "shield" | "users" | "wrench";

export interface IuranPost {
  id: string;
  title: string;
  description: string;
  icon: IuranIcon;
  accent: "indigo" | "rose";
  badges: { label: string; tone: BadgeTone }[];
  price: number;
  priceUnit: string;
  details?: { label: string; value: string; positive?: boolean }[];
  progress?: { collected: number; target: number; paidKK: number; period: string; unpaidNote: string };
  actions: { label: string; icon: "edit" | "eye" | "bell" }[];
  active?: boolean; // menampilkan switch aktif/nonaktif
}

/* ---------- Laporan ---------- */
export interface PosRealization {
  id: string;
  name: string;
  tariffLabel: string;
  target: number;
  collected: number;
  paidKK: number;
  totalKK: number;
  statusLabel: string;
  statusTone: BadgeTone;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  post: string;
  account: string;
  amount: number; // positif = masuk, negatif = keluar
  verification: string;
}
