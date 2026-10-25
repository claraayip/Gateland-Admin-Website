import type { ReactNode } from "react";
import { AdminShell } from "@/components/layout/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `if (typeof window !== "undefined" && !localStorage.getItem("gateland_token")) { window.location.replace("/"); }`,
        }}
      />
      <AdminShell>{children}</AdminShell>
    </>
  );
}
