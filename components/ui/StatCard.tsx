import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { cn } from "@/lib/cn";

type StatTone = "primary" | "success" | "danger" | "secondary";

const iconTones: Record<StatTone, string> = {
  primary: "bg-primary text-white",
  success: "bg-green-100 text-green-700",
  danger: "bg-red-100 text-red-600",
  secondary: "bg-indigo-100 text-primary",
};

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: StatTone;

  inverted?: boolean;
  valueClassName?: string;
  className?: string;

  children?: ReactNode;
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
  inverted = false,
  valueClassName,
  className,
  children,
}: StatCardProps) {
  return (
    <Card className={cn("flex flex-col gap-4 p-5", inverted && "border-primary bg-primary text-white", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn("text-[11px] font-bold tracking-wide uppercase", inverted ? "text-indigo-200" : "text-muted")}>
            {label}
          </p>
          <p className={cn("mt-1.5 text-2xl font-bold break-words", inverted ? "text-white" : "text-ink", valueClassName)}>
            {value}
          </p>
          {hint && <p className={cn("mt-1 text-xs", inverted ? "text-indigo-200" : "text-muted")}>{hint}</p>}
        </div>
        <div
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl",
            inverted ? "bg-white/15 text-white" : iconTones[tone],
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
      {children}
    </Card>
  );
}
