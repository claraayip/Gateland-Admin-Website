"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Terjadi kesalahan pada aplikasi:", error);
  }, [error]);

  return (
    <main className="grid min-h-[60vh] place-items-center px-6 py-16">
      <section className="max-w-md text-center">
        <p className="text-sm font-semibold text-red-600">Terjadi Kesalahan</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Halaman tidak dapat dimuat</h1>
        <p className="mt-2 text-sm text-slate-600">Maaf, terjadi kendala saat memproses halaman ini. Silakan coba lagi.</p>
        <button onClick={() => reset()} className="mt-6 rounded-xl bg-[#090877] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#07066C]">Coba Lagi</button>
      </section>
    </main>
  );
}
