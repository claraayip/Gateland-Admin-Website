"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpZA,
  Calendar,
  CircleCheck,
  Clock,
  Download,
  Phone,
  Search,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Table, type Column } from "@/components/ui/Table";
import { AddResidentModal } from "./AddResidentModal";
import { ResidentDetailModal } from "./ResidentDetailModal";
import { getInitials } from "@/lib/format";
import type { PaymentState, Resident } from "@/lib/types";
import { cn } from "@/lib/cn";

interface PenghuniViewProps {
  initialResidents: Resident[];
  totalAll: number;
  unitOptions: { value: string; label: string }[];
  period: string;
}

type Filter = "semua" | "verifikasi";
type SortDirection = "asc" | "desc" | null;

const paymentPill: Record<PaymentState, { className: string; icon: LucideIcon }> = {
  lunas: { className: "bg-emerald-50 text-emerald-700", icon: CircleCheck },
  belum_lunas: { className: "bg-red-50 text-red-700", icon: Clock },
  menunggu_verifikasi: { className: "bg-red-50 text-red-700", icon: Clock },
};

export function PenghuniView({ initialResidents, totalAll, unitOptions, period }: PenghuniViewProps) {
  const [residents, setResidents] = useState(initialResidents);
  const [filter, setFilter] = useState<Filter>("semua");
  const [query, setQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const pendingVerification = residents.filter((resident) => resident.status === "baru_registrasi").length;
  const selected = residents.find((resident) => resident.id === selectedId) ?? null;

  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const filtered = residents.filter((resident) => {
      if (filter === "verifikasi" && resident.status !== "baru_registrasi") return false;
      if (!keyword) return true;
      return [resident.name, resident.phone, resident.block, resident.number].join(" ").toLowerCase().includes(keyword);
    });
    if (!sortDirection) return filtered;
    const factor = sortDirection === "asc" ? 1 : -1;
    return [...filtered].sort(
      (a, b) =>
        `${a.block} ${a.number}`.localeCompare(`${b.block} ${b.number}`, "id", { numeric: true }) * factor,
    );
  }, [residents, filter, query, sortDirection]);

  function handleAdd(form: FormData) {
    const text = (key: string) => String(form.get(key) ?? "").trim();
    const [block = "", number = ""] = text("unit").split("-");

    const created: Resident = {
      id: `r-${Date.now()}`,
      name: text("name"),
      phone: text("whatsapp"),
      block: `Blok ${block}`,
      number: `No. ${number}`,
      memberCount: Number(text("members")) || 1,
      memberSummary: "Belum dirinci",
      status: "baru_registrasi",
      payment: { state: "menunggu_verifikasi", label: "Menunggu Verifikasi" },
    };
    setResidents((list) => [created, ...list]);
    setAddOpen(false);
    setNotice(`${created.name} berhasil ditambahkan dan menunggu verifikasi.`);
  }

  function handleVerify(resident: Resident) {
    setResidents((list) => list.map((item) => (item.id === resident.id ? { ...item, status: "aktif" } : item)));
    setNotice(`Akun ${resident.name} terverifikasi.`);
  }

  const columns: Column<Resident>[] = [
    {
      key: "account",
      header: "Akun Warga & Kontak",
      cell: (resident) => (
        <div className="flex items-center gap-3">
          <Avatar initials={getInitials(resident.name)} tone="navy" />
          <div className="min-w-0 space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedId(resident.id)}
                className="cursor-pointer text-left font-semibold text-ink hover:text-primary hover:underline"
              >
                {resident.name}
              </button>
              <Badge tone={resident.status === "aktif" ? "green" : "darkred"}>
                {resident.status === "aktif" ? "Aktif" : "BARU REGISTRASI"}
              </Badge>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <Phone className="size-3" aria-hidden="true" /> {resident.phone}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "unit",
      header: "Unit / Blok / Alamat",
      cell: (resident) => (
        <div>
          <p className="font-semibold text-ink">{resident.block}</p>
          <p className="text-xs text-muted">{resident.number}</p>
        </div>
      ),
    },
    {
      key: "family",
      header: "Anggota KK",
      cell: (resident) => (
        <div>
          <p className="flex items-center gap-1.5 font-semibold text-ink">
            <Users className="size-3.5 text-muted" aria-hidden="true" /> {resident.memberCount} jiwa
          </p>
          <p className="text-xs text-muted">{resident.memberSummary}</p>
        </div>
      ),
    },
    {
      key: "payment",
      header: "Status Pembayaran",
      cell: (resident) => {
        const { className, icon: Icon } = paymentPill[resident.payment.state];
        return (
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", className)}>
            <Icon className="size-3.5" aria-hidden="true" /> {resident.payment.label}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: <span className="sr-only">Aksi</span>,
      cell: (resident) =>
        resident.status === "baru_registrasi" ? (
          <Button size="sm" onClick={() => handleVerify(resident)}>
            Verifikasi Akun
          </Button>
        ) : null,
    },
  ];

  const SortIcon = sortDirection === "desc" ? ArrowUpZA : ArrowDownAZ;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={
          <>
            <Badge tone="purple">• Cluster Gardenia & Boulevard</Badge>
            <Badge tone="gray">• Database Warga Aktif RT 04 / RW 08</Badge>
          </>
        }
        title="Manajemen Data Penghuni"
        description="Kelola direktori warga, status kependudukan dan pembayaran, verifikasi akun registrasi, dan akses administrasi GateLand."
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" aria-hidden="true" /> Ekspor Data (Excel/CSV)
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <UserPlus className="size-4" aria-hidden="true" /> Tambah Penghuni Baru
            </Button>
          </>
        }
      />

      {notice && (
        <p role="status" className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
          {notice}
          <button type="button" onClick={() => setNotice(null)} className="cursor-pointer font-semibold underline">
            Tutup
          </button>
        </p>
      )}

      <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter penghuni" className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={filter === "semua"}
            onClick={() => setFilter("semua")}
            className={cn(
              "cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-colors",
              filter === "semua" ? "bg-primary text-white" : "bg-slate-100 text-muted hover:bg-slate-200",
            )}
          >
            Semua Penghuni ({totalAll})
          </button>
          <button
            type="button"
            aria-pressed={filter === "verifikasi"}
            onClick={() => setFilter("verifikasi")}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
              filter === "verifikasi" ? "bg-primary text-white" : "bg-red-50 text-red-700 hover:bg-red-100",
            )}
          >
            <span className="size-1.5 rounded-full bg-red-500" aria-hidden="true" />
            Perlu Verifikasi ({pendingVerification})
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-muted">
            <Calendar className="size-4" aria-hidden="true" />
            <span>
              Periode: <strong className="text-ink">{period}</strong>
            </span>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Cari penghuni"
              placeholder="Cari nama, no. WhatsApp, blok..."
              className="w-full rounded-full border border-line bg-slate-50 py-2.5 pr-4 pl-10 text-xs placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none sm:w-72"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-bold text-ink">Daftar Penghuni RT 04</h2>
            <Badge tone="purple">
              Menampilkan {visible.length} dari {totalAll} KK
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortDirection((current) => (current === "asc" ? "desc" : "asc"))}
          >
            <SortIcon className="size-4" aria-hidden="true" />
            Urutkan Blok {sortDirection === "desc" ? "Z-A" : "A-Z"}
          </Button>
        </div>

        <Table
          columns={columns}
          rows={visible}
          getRowKey={(resident) => resident.id}
          caption="Daftar penghuni"
          emptyMessage="Tidak ada penghuni yang cocok dengan filter."
        />
      </Card>

      <AddResidentModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        unitOptions={unitOptions}
      />
      <ResidentDetailModal resident={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
}
