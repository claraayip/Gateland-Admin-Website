import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-6 py-16">
      <section className="max-w-md text-center">
        <p className="text-sm font-bold tracking-widest text-[#090877]">404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-sm text-slate-600">Halaman yang kamu cari tidak tersedia atau alamatnya sudah berubah.</p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-[#090877] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#07066C]">Kembali ke Beranda</Link>
      </section>
    </main>
  );
}
