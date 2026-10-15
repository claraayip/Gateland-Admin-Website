import { cn } from "@/lib/cn";

const fills = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-success",
} as const;

interface ProgressBarProps {
  value: number; // 0-100
  tone?: keyof typeof fills;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, tone = "primary", label, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-slate-200", className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-500", fills[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
