import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('gateland_token')?.value;
  const { pathname } = request.nextUrl;

  // Halaman yang wajib login (semua menu admin)
  const protectedRoutes = [
    '/dashboard',
    '/penghuni',
    '/iuran',
    '/laporan',
    '/pengaturan',
    '/pengumuman',
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Jika mencoba akses rute admin tanpa cookie token, langsung pentalin (redirect 307) ke login (/)
  if (isProtected && !token) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard',
    '/penghuni/:path*',
    '/penghuni',
    '/iuran/:path*',
    '/iuran',
    '/laporan/:path*',
    '/laporan',
    '/pengaturan/:path*',
    '/pengaturan',
    '/pengumuman/:path*',
    '/pengumuman',
  ],
};
