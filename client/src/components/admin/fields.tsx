"use client";

import { Calendar, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

function Field({
  label,
  htmlFor,
  error,
  hint,
  children
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

type InputProps = React.ComponentProps<"input"> & {
  label: string;
  error?: string;
  hint?: string;
};

export function TextField({ label, error, hint, id, ...props }: InputProps) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <Input id={id} aria-invalid={!!error} {...props} />
    </Field>
  );
}

export function NumberField({ label, error, hint, id, ...props }: InputProps) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <Input id={id} type="number" step="any" aria-invalid={!!error} {...props} />
    </Field>
  );
}

function toMonthInput(value?: string): string {
  if (!value) return "";
  const full = value.trim().match(/^(\d{4})-(\d{2})$/);
  if (full) return `${full[1]}-${full[2]}`;
  const year = value.trim().match(/^(\d{4})$/);
  if (year) return `${year[1]}-01`;
  return "";
}

export function MonthField({
  label,
  error,
  hint,
  id,
  value,
  onChange,
  placeholder
}: {
  label: string;
  error?: string;
  hint?: string;
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <div className="relative">
        <Input
          id={id}
          value={value ?? ""}
          placeholder={placeholder}
          aria-invalid={!!error}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
        />
        <label
          className="absolute top-1 right-1 flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Pick a month"
        >
          <Calendar className="size-4" />
          <input
            type="month"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute inset-0 cursor-pointer opacity-0"
            value={toMonthInput(value)}
            onChange={(e) => {
              if (e.target.value) onChange(e.target.value);
            }}
          />
        </label>
      </div>
    </Field>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  id,
  ...props
}: React.ComponentProps<"textarea"> & {
  label: string;
  error?: string;
  hint?: string;
}) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <Textarea id={id} aria-invalid={!!error} {...props} />
    </Field>
  );
}

export function ListField({
  label,
  error,
  hint = "Separate items with · , or | to add multiple at once.",
  value,
  onChange
}: {
  label: string;
  error?: string;
  hint?: string;
  value?: string[];
  onChange: (value: string[]) => void;
}) {
  const items = value ?? [];
  const DELIM = /[·,|]/;

  function splitItems(text: string): string[] {
    return text
      .split(DELIM)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>, index: number) {
    const pasted = e.clipboardData.getData("text");
    if (!DELIM.test(pasted)) return;
    e.preventDefault();
    const newItems = splitItems(pasted);
    if (newItems.length === 0) return;
    const next = items.filter((_, i) => i !== index);
    onChange([...next, ...newItems]);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>, index: number) {
    const val = e.target.value;
    if (!DELIM.test(val)) return;
    const newItems = splitItems(val);
    if (newItems.length === 0) return;
    const next = items.filter((_, i) => i !== index);
    onChange([...next, ...newItems]);
  }

  return (
    <Field label={label} error={error} hint={hint}>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              aria-invalid={!!error}
              autoFocus={item === "" && index === items.length - 1}
              onChange={(e) => {
                const next = [...items];
                next[index] = e.target.value;
                onChange(next.map((s) => s.trim()).filter(Boolean));
              }}
              onPaste={(e) => handlePaste(e, index)}
              onBlur={(e) => handleBlur(e, index)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Delete item ${index + 1}`}
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => onChange([...items, ""])}
        >
          <Plus className="size-4" />
          Add item
        </Button>
      </div>
    </Field>
  );
}

export function ColorField({
  label,
  error,
  hint,
  value,
  onChange,
  id
}: {
  label: string;
  error?: string;
  hint?: string;
  value?: string;
  onChange: (value: string) => void;
  id?: string;
}) {
  const current = value || "#000000";
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <div className="flex items-center gap-2">
        <label className="relative block h-9 w-16 cursor-pointer overflow-hidden rounded-lg border border-input">
          <input
            type="color"
            id={id}
            aria-invalid={!!error}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            value={current}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="absolute inset-0" style={{ backgroundColor: current }} />
        </label>
        <span className="font-mono text-sm text-muted-foreground">{value || "Not set"}</span>
      </div>
    </Field>
  );
}

export function SwitchField({
  label,
  description,
  checked,
  onCheckedChange
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
