import { cookies } from "next/headers";

export interface SessionUser {
  id: number | string;
  name: string;
  email: string;
  role: string;
}

export async function getSessionToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("gateland_token");
    return token?.value || null;
  } catch {
    // Pada saat static build / prerender, cookies() belum tersedia
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = await getSessionToken();
  if (!token) {
    return null;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    if (json.status === "success" && json.data) {
      return json.data;
    }
  } catch {
    // Backend offline
  }

  // Jika server backend offline sementara, baca payload token bila ada
  try {
    const base64Payload = token.split(".")[1];
    if (base64Payload) {
      const decoded = JSON.parse(Buffer.from(base64Payload, "base64").toString("utf-8"));
      return {
        id: decoded.id || "admin",
        name: decoded.name || "Bpk. Andi Putra Wijaya",
        email: decoded.email || "admin@gmail.com",
        role: decoded.role || "ADMIN",
      };
    }
  } catch {
    // Abaikan jika token invalid
  }

  return null;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED: Anda belum login atau sesi telah berakhir!");
  }

  const roleUpper = String(user.role).toUpperCase();
  if (roleUpper !== "ADMIN") {
    throw new Error("FORBIDDEN: Anda tidak memiliki akses admin website!");
  }

  return user;
}
