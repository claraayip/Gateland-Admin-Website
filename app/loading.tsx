export default function Loading() {
  return (
    <main className="grid min-h-[50vh] place-items-center px-6 py-16" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="size-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#090877]" />
        <p className="text-sm font-medium text-slate-600">Memuat halaman...</p>
      </div>
    </main>
  );
}
