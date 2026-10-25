import type { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "@/lib/cn";

interface FormSectionProps {
  marker: ReactNode;
  title: string;
  subtitle?: string;
  aside?: ReactNode;

  variant?: "card" | "plain";
  children: ReactNode;
  className?: string;
}

export function FormSection({
  marker,
  title,
  subtitle,
  aside,
  variant = "card",
  children,
  className,
}: FormSectionProps) {
  const body = (
    <>
      <div className="mb-5 flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
          {marker}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-ink">{title}</h2>
          {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
        </div>
        {aside}
      </div>
      <div className="space-y-5">{children}</div>
    </>
  );

  if (variant === "plain") {
    return <section className={cn("rounded-xl border border-line bg-slate-50/60 p-4 sm:p-5", className)}>{body}</section>;
  }
  return <Card className={cn("p-5 sm:p-6", className)}>{body}</Card>;
}
