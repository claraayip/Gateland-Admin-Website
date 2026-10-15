import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

const controlClass =
  "w-full rounded-control border border-line bg-slate-50 px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-400 transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger";

interface FieldProps {
  /** Wajib: dipakai sebagai name sekaligus id & penghubung label. */
  name: string;
  label: string;
  hint?: string;
  error?: string;
  /** Elemen di sisi kanan label, mis. penghitung karakter. */
  labelTrailing?: ReactNode;
  labelClassName?: string;
  wrapperClassName?: string;
}

function FieldShell({
  name,
  label,
  hint,
  error,
  required,
  labelTrailing,
  labelClassName,
  wrapperClassName,
  children,
}: FieldProps & { required?: boolean; children: ReactNode }) {
  return (
    <div className={cn("space-y-1.5", wrapperClassName)}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={name} className={cn("text-xs font-semibold text-ink", labelClassName)}>
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {labelTrailing}
      </div>
      {children}
      {error ? (
        <p id={`${name}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${name}-hint`} className="text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function describedBy(name: string, hint?: string, error?: string) {
  if (error) return `${name}-error`;
  return hint ? `${name}-hint` : undefined;
}

/* ---------------- Input ---------------- */
type InputProps = FieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "name"> & {
    /** Ikon/elemen di dalam input, sisi kiri & kanan. */
    leading?: ReactNode;
    trailing?: ReactNode;
  };

export function FormInput({
  name,
  label,
  hint,
  error,
  labelTrailing,
  labelClassName,
  wrapperClassName,
  leading,
  trailing,
  className,
  required,
  ...props
}: InputProps) {
  return (
    <FieldShell
      {...{ name, label, hint, error, labelTrailing, labelClassName, wrapperClassName, required }}
    >
      <div className="relative flex items-center">
        {leading && (
          <span className="pointer-events-none absolute left-3.5 text-slate-400">{leading}</span>
        )}
        <input
          id={name}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(name, hint, error)}
          className={cn(controlClass, leading && "pl-11", trailing && "pr-11", className)}
          {...props}
        />
        {trailing && <span className="absolute right-2.5 flex items-center">{trailing}</span>}
      </div>
    </FieldShell>
  );
}

/* ---------------- Textarea ---------------- */
type TextareaProps = FieldProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name">;

export function FormTextarea({
  name,
  label,
  hint,
  error,
  labelTrailing,
  labelClassName,
  wrapperClassName,
  className,
  required,
  ...props
}: TextareaProps) {
  return (
    <FieldShell
      {...{ name, label, hint, error, labelTrailing, labelClassName, wrapperClassName, required }}
    >
      <textarea
        id={name}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, hint, error)}
        className={cn(controlClass, "resize-y leading-relaxed", className)}
        {...props}
      />
    </FieldShell>
  );
}

/* ---------------- Select ---------------- */
type SelectProps = FieldProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "name"> & {
    options: { value: string; label: string }[];
    placeholder?: string;
  };

export function FormSelect({
  name,
  label,
  hint,
  error,
  labelTrailing,
  labelClassName,
  wrapperClassName,
  className,
  required,
  options,
  placeholder,
  defaultValue = "",
  ...props
}: SelectProps) {
  return (
    <FieldShell
      {...{ name, label, hint, error, labelTrailing, labelClassName, wrapperClassName, required }}
    >
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, hint, error)}
        className={cn(controlClass, className)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
