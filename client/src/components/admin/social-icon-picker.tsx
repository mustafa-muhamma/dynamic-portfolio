"use client";

import { Check, X } from "lucide-react";

import { FilePicker } from "@/components/admin/file-picker";
import { SocialIcon } from "@/components/public/social-icon";
import { Button } from "@/components/ui/button";
import { SOCIAL_ICON_GROUPS, SOCIAL_ICON_LABELS, type SocialIconKey } from "@/lib/social-icons";
import { cn } from "@/lib/utils";

export type SocialIconValue = { icon?: string; iconUrl?: string };

export function SocialIconPicker({
  value,
  onChange
}: {
  value: SocialIconValue;
  onChange: (next: SocialIconValue) => void;
}) {
  const selectedKey = value.icon?.trim().toLowerCase() as SocialIconKey | undefined;
  const hasCustom = Boolean(value.iconUrl?.trim());
  const isPreset = (key: SocialIconKey) => !hasCustom && selectedKey === key;

  return (
    <div className="flex flex-col gap-4">
      {SOCIAL_ICON_GROUPS.map((group) => (
        <div key={group.group}>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">{group.group}</p>
          <div className="flex flex-wrap gap-2">
            {group.keys.map((key) => {
              const active = isPreset(key);
              return (
                <button
                  key={key}
                  type="button"
                  title={SOCIAL_ICON_LABELS[key]}
                  aria-pressed={active}
                  onClick={() => onChange({ icon: key, iconUrl: "" })}
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-lg border transition-colors",
                    active
                      ? "border-brand-1 bg-brand-1/10 text-brand-1"
                      : "border-border text-muted-foreground hover:border-brand-1 hover:text-brand-1"
                  )}
                >
                  <SocialIcon icon={key} className="size-5" />
                  {active ? (
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand-1 text-white">
                      <Check className="size-3" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div>
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Custom icon</p>
        {hasCustom ? (
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <img
              src={value.iconUrl}
              alt=""
              aria-hidden="true"
              className="size-10 shrink-0 rounded-md object-cover"
            />
            <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{value.iconUrl}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange({ icon: "", iconUrl: "" })}
            >
              <X className="size-3.5" />
              Remove
            </Button>
          </div>
        ) : (
          <FilePicker
            label="Custom icon"
            kind="image"
            value={value.iconUrl}
            onChange={(url) => onChange({ icon: "", iconUrl: url })}
            hint="Upload your own icon. PNG, JPG, WebP, GIF, or SVG. Max 5MB."
          />
        )}
      </div>
    </div>
  );
}
