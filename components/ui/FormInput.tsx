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
  name: string;
  label: string;
  hint?: string;
  error?: string;

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
          {required ? (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
        {labelTrailing}
      </div>
      {children}
      {error ? (
        <p id={`${name}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(name: string, hint?: string, error?: string) {
  if (error) return `${name}-error`;
  return hint ? `${name}-hint` : undefined;
}

type InputProps = FieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "name"> & {
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
  required,
  leading,
  trailing,
  className,
  ...props
}: InputProps) {
  return (
    <FieldShell
      name={name}
      label={label}
      hint={hint}
      error={error}
      labelTrailing={labelTrailing}
      labelClassName={labelClassName}
      wrapperClassName={wrapperClassName}
      required={required}
    >
      <div className="relative flex items-center">
        {leading ? (
          <span className="pointer-events-none absolute left-3.5 text-slate-400">{leading}</span>
        ) : null}
        <input
          id={name}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(name, hint, error)}
          className={cn(controlClass, leading ? "pl-11" : undefined, trailing ? "pr-11" : undefined, className)}
          {...props}
        />
        {trailing ? <span className="absolute right-2.5 flex items-center">{trailing}</span> : null}
      </div>
    </FieldShell>
  );
}

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
      name={name}
      label={label}
      hint={hint}
      error={error}
      labelTrailing={labelTrailing}
      labelClassName={labelClassName}
      wrapperClassName={wrapperClassName}
      required={required}
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
      name={name}
      label={label}
      hint={hint}
      error={error}
      labelTrailing={labelTrailing}
      labelClassName={labelClassName}
      wrapperClassName={wrapperClassName}
      required={required}
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
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
