import type { AvatarTone } from "@/lib/types";
import { cn } from "@/lib/cn";

const tones: Record<AvatarTone, string> = {
  navy: "bg-primary text-white",
  blue: "bg-blue-100 text-blue-800",
  purple: "bg-violet-100 text-secondary",
  pink: "bg-pink-100 text-pink-800",
};

const sizes = { sm: "size-8 text-[11px]", md: "size-10 text-xs", lg: "size-14 text-base" } as const;

interface AvatarProps {
  initials: string;
  tone?: AvatarTone;
  size?: keyof typeof sizes;
  className?: string;
}

export function Avatar({ initials, tone = "blue", size = "md", className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full font-bold",
        tones[tone],
        sizes[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}
