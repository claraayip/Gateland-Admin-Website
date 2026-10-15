import type { HTMLAttributes } from "react";
import type { BadgeTone } from "@/lib/types";
import { cn } from "@/lib/cn";

const tones: Record<BadgeTone, string> = {
  indigo: "bg-indigo-100 text-primary",
  green: "bg-green-100 text-green-800",
  rose: "bg-rose-100 text-rose-800",
  pink: "bg-rose-light text-red-700",
  red: "bg-red-50 text-red-700",
  darkred: "bg-red-900 text-white",
  purple: "bg-violet-100 text-secondary",
  gray: "bg-slate-100 text-muted",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "gray", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
