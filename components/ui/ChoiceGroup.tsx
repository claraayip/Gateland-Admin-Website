import { cn } from "@/lib/cn";

export interface ChoiceOption {
  value: string;
  label: string;
  /** Hanya untuk variant "card". */
  title?: string;
  description?: string;
}

interface ChoiceGroupProps {
  name: string;
  legend: string;
  options: ChoiceOption[];
  defaultValue: string;
  variant?: "chip" | "card";
  required?: boolean;
  /** Kelas grid untuk variant "card", mis. "sm:grid-cols-3". */
  columnsClassName?: string;
}

/**
 * Radio group bergaya chip/kartu.
 * Menggantikan script asli yang menambah/menghapus class `.active` secara manual:
 * state "terpilih" cukup dari radio native + variant `has-checked`, tanpa useState.
 */
export function ChoiceGroup({
  name,
  legend,
  options,
  defaultValue,
  variant = "chip",
  required,
  columnsClassName = "sm:grid-cols-2",
}: ChoiceGroupProps) {
  const selectedStyle =
    "has-[:checked]:border-primary has-[:checked]:bg-indigo-50 has-[:checked]:text-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40";

  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-xs font-semibold text-ink">
        {legend}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      <div className={cn(variant === "chip" ? "flex flex-wrap gap-2" : cn("grid grid-cols-1 gap-3", columnsClassName))}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "cursor-pointer border border-line bg-white transition-colors hover:border-slate-300",
              selectedStyle,
              variant === "chip"
                ? "rounded-full px-4 py-2 text-xs font-medium text-muted"
                : "flex flex-col gap-0.5 rounded-xl p-4",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={option.value === defaultValue}
              required={required}
              className="sr-only"
            />
            {variant === "chip" ? (
              option.label
            ) : (
              <>
                <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">{option.label}</span>
                {option.title && <span className="text-base font-bold text-ink">{option.title}</span>}
                {option.description && <span className="text-xs text-muted">{option.description}</span>}
              </>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
