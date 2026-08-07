"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Loader2, Upload } from "lucide-react";
import type { FormEventHandler, ReactNode } from "react";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

import {
  ColorField,
  ListField,
  MonthField,
  NumberField,
  SwitchField,
  TextAreaField,
  TextField
} from "@/components/admin/fields";
import { FilePicker, ImageListPicker } from "@/components/admin/file-picker";
import type { ResourceFormProps } from "@/components/admin/collection-manager";
import { useCollectionList } from "@/hooks/use-content";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DOCUMENT_ACCEPT, uploadResumeFile, validateFile } from "@/lib/media";
import type {
  ContactSettings,
  Education,
  Experience,
  Hero,
  Pricing,
  Process,
  Profile,
  Project,
  Resume,
  Service,
  SiteSettings,
  Skill,
  SocialLink,
  Testimonial
} from "@/lib/content";

const requiredString = z.string().trim().min(1, "Required");
const optionalString = z.string().trim().optional();
const optionalNumber = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(v)),
  z.number().optional()
);
const optionalBool = z.boolean().optional();
const optionalArray = z.preprocess(
  (v) =>
    typeof v === "string"
      ? v
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : v,
  z.array(z.string().trim()).optional()
);

function FormShell({
  children,
  onSubmit,
  onCancel,
  submitting
}: {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel?: () => void;
  submitting: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {children}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}

const profileSchema = z.object({
  name: requiredString,
  title: requiredString,
  tagline: optionalString,
  bio: optionalString,
  photo: optionalString,
  yearsExperience: optionalNumber,
  contactEmail: z.string().trim().email("Enter a valid email address")
});

export function ProfileForm({
  defaultValues,
  isEdit,
  submitting,
  onSubmit,
  onCancel
}: ResourceFormProps<Profile>) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultValues ?? {}
  });
  const photo = useWatch({ control, name: "photo" });

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <TextField label="Name" id="name" error={errors.name?.message} {...register("name")} />
      <TextField label="Title" id="title" error={errors.title?.message} {...register("title")} />
      <TextField
        label="Tagline"
        id="tagline"
        error={errors.tagline?.message}
        {...register("tagline")}
      />
      <TextAreaField
        label="Bio"
        id="bio"
        error={errors.bio?.message}
        rows={5}
        {...register("bio")}
      />
      <FilePicker
        label="Photo"
        kind="image"
        value={photo}
        onChange={(v) => setValue("photo", v, { shouldDirty: true })}
        error={errors.photo?.message}
        hint="PNG, JPG, WebP, GIF, or SVG. Max 5MB."
      />
      <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
        The <strong className="font-medium text-foreground">Download resume</strong> button on the
        public site is managed in the{" "}
        <Link href="/admin/resume" className="font-medium text-brand-1 hover:underline">
          Resume section
        </Link>
        . Upload the file there and it is served through the download endpoint — no need to add it
        here.
      </div>
      <TextField
        label="Contact email"
        id="contactEmail"
        type="email"
        error={errors.contactEmail?.message}
        {...register("contactEmail")}
      />
      <NumberField
        label="Years of experience"
        id="yearsExperience"
        error={errors.yearsExperience?.message}
        hint="Used for the hero stats row. Leave empty to hide."
        {...register("yearsExperience")}
      />
      {isEdit ? null : (
        <p className="text-xs text-muted-foreground">Create the profile to get started.</p>
      )}
    </FormShell>
  );
}

function formatBytes(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ResumeForm({ defaultValues }: ResourceFormProps<Resume>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const validation = validateFile(file, "document");
    if (validation) {
      setError(validation);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setUploading(true);
    setError(undefined);
    setSuccess(false);
    try {
      await uploadResumeFile(file);
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["resume"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Resume file</Label>
        <div className="flex items-center gap-3 rounded-lg border p-3">
          {uploading ? (
            <Loader2 className="size-10 animate-spin text-muted-foreground" />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <FileText className="size-5" />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                {uploading ? "Uploading..." : "Upload"}
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept={DOCUMENT_ACCEPT}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              PDF, DOC, or DOCX. Max 5MB. Replaces the current resume file.
            </p>
          </div>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {success ? <p className="text-sm text-brand-2">Resume uploaded successfully.</p> : null}
      </div>
      {defaultValues?.fileName ? (
        <div className="rounded-lg border p-3 text-sm">
          <p className="font-medium">{defaultValues.fileName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {defaultValues.mimeType}
            {defaultValues.size ? ` · ${formatBytes(defaultValues.size)}` : ""}
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          No resume uploaded yet. The file becomes available on the public site after upload.
        </p>
      )}
    </div>
  );
}

const heroSchema = z.object({
  eyebrow: optionalString,
  heading: requiredString,
  subheading: optionalString,
  primaryCtaLabel: optionalString,
  primaryCtaUrl: optionalString,
  secondaryCtaLabel: optionalString,
  image: optionalString,
  backgroundType: z.enum(["color", "image"]).optional(),
  backgroundColor: optionalString,
  backgroundImage: optionalString,
  animated: optionalBool,
  published: optionalBool
});

export function HeroForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel
}: ResourceFormProps<Hero>) {
  const {
    handleSubmit,
    setValue,
    control,
    register,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(heroSchema),
    defaultValues: defaultValues ?? {}
  });
  const image = useWatch({ control, name: "image" });
  const backgroundType = useWatch({ control, name: "backgroundType" });
  const backgroundColor = useWatch({ control, name: "backgroundColor" });
  const backgroundImage = useWatch({ control, name: "backgroundImage" });
  const animated = useWatch({ control, name: "animated" });
  const published = useWatch({ control, name: "published" });

  return (
    <FormShell onSubmit={handleSubmit(onSubmit)} onCancel={onCancel} submitting={submitting}>
      <TextField label="Eyebrow" hint="Small line above the heading" {...register("eyebrow")} />
      <TextField label="Heading" error={errors.heading?.message} {...register("heading")} />
      <TextAreaField
        label="Subheading"
        hint="One or two sentences of intro text"
        {...register("subheading")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Primary CTA label"
          hint="e.g. View my work"
          {...register("primaryCtaLabel")}
        />
        <TextField label="Primary CTA URL" {...register("primaryCtaUrl")} />
        <TextField
          label="Secondary CTA label"
          hint="e.g. Download my resume — links to the uploaded resume file"
          {...register("secondaryCtaLabel")}
        />
      </div>
      <FilePicker
        label="Hero image"
        kind="image"
        value={image}
        onChange={(url) => setValue("image", url, { shouldDirty: true })}
        onUploaded={(asset) => setValue("image", asset.url, { shouldDirty: true })}
        error={errors.image?.message}
      />
      <div>
        <span className="mb-1.5 block text-sm font-medium">Background type</span>
        <Select
          value={backgroundType ?? null}
          onValueChange={(v) =>
            setValue("backgroundType", (v ?? "color") as "color" | "image", {
              shouldDirty: true
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select background type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="color">Solid color</SelectItem>
            <SelectItem value="image">Image</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {backgroundType === "image" ? (
        <FilePicker
          label="Background image"
          kind="image"
          value={backgroundImage}
          onChange={(url) => setValue("backgroundImage", url, { shouldDirty: true })}
          onUploaded={(asset) => setValue("backgroundImage", asset.url, { shouldDirty: true })}
        />
      ) : (
        <ColorField
          label="Background color"
          hint="Click the swatch to pick a color"
          value={backgroundColor}
          onChange={(v) => setValue("backgroundColor", v, { shouldDirty: true })}
        />
      )}
      <SwitchField
        label="Animated"
        description="Enable the animated heading effect on the public site"
        checked={Boolean(animated)}
        onCheckedChange={(v) => setValue("animated", v, { shouldDirty: true })}
      />
      <SwitchField
        label="Published"
        description="Visible on the public site"
        checked={Boolean(published)}
        onCheckedChange={(v) => setValue("published", v, { shouldDirty: true })}
      />
    </FormShell>
  );
}

const experienceSchema = z.object({
  role: requiredString,
  company: requiredString,
  location: optionalString,
  start: optionalString,
  end: optionalString,
  current: optionalBool,
  summary: optionalString,
  bullets: optionalArray,
  order: optionalNumber,
  published: optionalBool
});

export function ExperienceForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel
}: ResourceFormProps<Experience>) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: { current: false, published: false, ...defaultValues }
  });
  const bullets = useWatch({ control, name: "bullets" }) as string[] | undefined;
  const current = useWatch({ control, name: "current" });
  const published = useWatch({ control, name: "published" });
  const start = useWatch({ control, name: "start" });
  const end = useWatch({ control, name: "end" });

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Role" id="role" error={errors.role?.message} {...register("role")} />
        <TextField
          label="Company"
          id="company"
          error={errors.company?.message}
          {...register("company")}
        />
      </div>
      <TextField
        label="Location"
        id="location"
        error={errors.location?.message}
        {...register("location")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MonthField
          label="Start"
          id="start"
          placeholder="2020-01"
          error={errors.start?.message}
          value={start}
          onChange={(v) => setValue("start", v, { shouldDirty: true })}
        />
        <MonthField
          label="End"
          id="end"
          placeholder="2023-06"
          error={errors.end?.message}
          value={end}
          onChange={(v) => setValue("end", v, { shouldDirty: true })}
        />
      </div>
      <TextAreaField
        label="Summary"
        id="summary"
        error={errors.summary?.message}
        rows={3}
        {...register("summary")}
      />
      <ListField label="Bullets" value={bullets} onChange={(v) => setValue("bullets", v)} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          label="Order"
          id="order"
          error={errors.order?.message}
          {...register("order")}
        />
      </div>
      <SwitchField
        label="Current role"
        description="Mark as the current position"
        checked={!!current}
        onCheckedChange={(c) => setValue("current", c)}
      />
      <SwitchField
        label="Published"
        description="Visible on the public site"
        checked={!!published}
        onCheckedChange={(c) => setValue("published", c)}
      />
    </FormShell>
  );
}

const educationSchema = z.object({
  degree: requiredString,
  school: requiredString,
  start: optionalString,
  end: optionalString,
  summary: optionalString,
  order: optionalNumber,
  published: optionalBool
});

export function EducationForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel
}: ResourceFormProps<Education>) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: { published: false, ...defaultValues }
  });
  const published = useWatch({ control, name: "published" });
  const start = useWatch({ control, name: "start" });
  const end = useWatch({ control, name: "end" });

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <TextField
        label="Degree"
        id="degree"
        error={errors.degree?.message}
        {...register("degree")}
      />
      <TextField
        label="School"
        id="school"
        error={errors.school?.message}
        {...register("school")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MonthField
          label="Start"
          id="start"
          placeholder="2020-01"
          error={errors.start?.message}
          value={start}
          onChange={(v) => setValue("start", v, { shouldDirty: true })}
        />
        <MonthField
          label="End"
          id="end"
          placeholder="2023-06"
          error={errors.end?.message}
          value={end}
          onChange={(v) => setValue("end", v, { shouldDirty: true })}
        />
      </div>
      <TextAreaField
        label="Summary"
        id="summary"
        error={errors.summary?.message}
        rows={3}
        {...register("summary")}
      />
      <NumberField label="Order" id="order" error={errors.order?.message} {...register("order")} />
      <SwitchField
        label="Published"
        description="Visible on the public site"
        checked={!!published}
        onCheckedChange={(c) => setValue("published", c)}
      />
    </FormShell>
  );
}

const skillSchema = z.object({
  name: requiredString,
  category: optionalString,
  level: z.coerce
    .number()
    .int()
    .min(1, "Must be between 1 and 5")
    .max(5, "Must be between 1 and 5"),
  order: optionalNumber,
  published: optionalBool
});

export function SkillForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel
}: ResourceFormProps<Skill>) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: { category: "General", level: 3, order: 0, published: false, ...defaultValues }
  });
  const published = useWatch({ control, name: "published" });

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <TextField label="Name" id="name" error={errors.name?.message} {...register("name")} />
      <TextField
        label="Category"
        id="category"
        error={errors.category?.message}
        {...register("category")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          label="Level (1–5)"
          id="level"
          error={errors.level?.message}
          {...register("level")}
        />
        <NumberField
          label="Order"
          id="order"
          error={errors.order?.message}
          {...register("order")}
        />
      </div>
      <SwitchField
        label="Published"
        description="Visible on the public site"
        checked={!!published}
        onCheckedChange={(c) => setValue("published", c)}
      />
    </FormShell>
  );
}

const projectSchema = z.object({
  title: requiredString,
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, "Lowercase letters, numbers, and dashes")
    .optional(),
  description: optionalString,
  role: optionalString,
  date: optionalString,
  link: optionalString,
  repo: optionalString,
  technologies: optionalArray,
  images: optionalArray,
  featured: optionalBool,
  inProgress: optionalBool,
  order: optionalNumber,
  published: optionalBool
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function ProjectForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel
}: ResourceFormProps<Project>) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { featured: false, inProgress: false, published: false, ...defaultValues }
  });
  const technologies = useWatch({ control, name: "technologies" }) as string[] | undefined;
  const images = useWatch({ control, name: "images" }) as string[] | undefined;
  const featured = useWatch({ control, name: "featured" });
  const published = useWatch({ control, name: "published" });
  const inProgress = useWatch({ control, name: "inProgress" });
  const slug = useWatch({ control, name: "slug" });
  const date = useWatch({ control, name: "date" });

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <TextField
        label="Title"
        id="title"
        error={errors.title?.message}
        {...register("title", {
          onChange: (e) => {
            if (!slug && e.target.value) {
              setValue("slug", slugify(e.target.value), { shouldDirty: true });
            }
          }
        })}
      />
      <TextField
        label="Slug"
        id="slug"
        error={errors.slug?.message}
        hint="Used for the public detail page URL — auto-filled from the title."
        {...register("slug")}
      />
      <TextAreaField
        label="Description"
        id="description"
        error={errors.description?.message}
        rows={3}
        {...register("description")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Role" id="role" error={errors.role?.message} {...register("role")} />
        <MonthField
          label="Date"
          id="date"
          placeholder="2024-03"
          hint="When the project was built."
          error={errors.date?.message}
          value={date}
          onChange={(v) => setValue("date", v, { shouldDirty: true })}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Link" id="link" error={errors.link?.message} {...register("link")} />
        <TextField
          label="Repository"
          id="repo"
          error={errors.repo?.message}
          {...register("repo")}
        />
      </div>
      <ListField
        label="Technologies"
        value={technologies}
        onChange={(v) => setValue("technologies", v)}
      />
      <ImageListPicker
        label="Images"
        value={images}
        onChange={(v) => setValue("images", v)}
        hint="PNG, JPG, WebP, GIF, or SVG. Max 5MB each."
      />
      <NumberField label="Order" id="order" error={errors.order?.message} {...register("order")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SwitchField
          label="Featured"
          description="Highlight on the public site"
          checked={!!featured}
          onCheckedChange={(c) => setValue("featured", c)}
        />
        <SwitchField
          label="In progress"
          description="A project I am currently working on"
          checked={!!inProgress}
          onCheckedChange={(c) => setValue("inProgress", c)}
        />
      </div>
      <SwitchField
        label="Published"
        description="Visible on the public site"
        checked={!!published}
        onCheckedChange={(c) => setValue("published", c)}
      />
    </FormShell>
  );
}

const socialLinkSchema = z.object({
  platform: requiredString,
  url: z.string().trim().url("Enter a valid URL"),
  order: optionalNumber,
  published: optionalBool
});

export function SocialLinkForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel
}: ResourceFormProps<SocialLink>) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: { published: false, ...defaultValues }
  });
  const published = useWatch({ control, name: "published" });

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Platform"
          id="platform"
          error={errors.platform?.message}
          {...register("platform")}
        />
        <NumberField
          label="Order"
          id="order"
          error={errors.order?.message}
          {...register("order")}
        />
      </div>
      <TextField label="URL" id="url" error={errors.url?.message} {...register("url")} />
      <SwitchField
        label="Published"
        description="Visible on the public site"
        checked={!!published}
        onCheckedChange={(c) => setValue("published", c)}
      />
    </FormShell>
  );
}

const serviceSchema = z.object({
  name: requiredString,
  description: optionalString,
  deliverables: optionalArray,
  price: optionalNumber,
  order: optionalNumber,
  published: optionalBool
});

export function ServiceForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel
}: ResourceFormProps<Service>) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: { published: false, ...defaultValues }
  });
  const deliverables = useWatch({ control, name: "deliverables" }) as string[] | undefined;
  const published = useWatch({ control, name: "published" });

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <TextField label="Name" id="name" error={errors.name?.message} {...register("name")} />
      <TextAreaField
        label="Description"
        id="description"
        error={errors.description?.message}
        rows={3}
        {...register("description")}
      />
      <ListField
        label="Deliverables"
        value={deliverables}
        onChange={(v) => setValue("deliverables", v)}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          label="Price"
          id="price"
          error={errors.price?.message}
          {...register("price")}
        />
        <NumberField
          label="Order"
          id="order"
          error={errors.order?.message}
          {...register("order")}
        />
      </div>
      <SwitchField
        label="Published"
        description="Visible on the public site"
        checked={!!published}
        onCheckedChange={(c) => setValue("published", c)}
      />
    </FormShell>
  );
}

const pricingSchema = z.object({
  tier: requiredString,
  price: optionalNumber,
  period: optionalString,
  features: optionalArray,
  order: optionalNumber,
  published: optionalBool
});

export function PricingForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel
}: ResourceFormProps<Pricing>) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(pricingSchema),
    defaultValues: { published: false, ...defaultValues }
  });
  const features = useWatch({ control, name: "features" }) as string[] | undefined;
  const published = useWatch({ control, name: "published" });

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <TextField label="Tier" id="tier" error={errors.tier?.message} {...register("tier")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          label="Price"
          id="price"
          error={errors.price?.message}
          {...register("price")}
        />
        <TextField
          label="Period"
          id="period"
          error={errors.period?.message}
          {...register("period")}
        />
      </div>
      <ListField label="Features" value={features} onChange={(v) => setValue("features", v)} />
      <NumberField label="Order" id="order" error={errors.order?.message} {...register("order")} />
      <SwitchField
        label="Published"
        description="Visible on the public site"
        checked={!!published}
        onCheckedChange={(c) => setValue("published", c)}
      />
    </FormShell>
  );
}

const processSchema = z.object({
  step: z.coerce.number().int().min(1, "Must be 1 or greater"),
  title: requiredString,
  description: optionalString,
  order: optionalNumber,
  published: optionalBool
});

export function ProcessForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel
}: ResourceFormProps<Process>) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(processSchema),
    defaultValues: { step: 1, published: false, ...defaultValues }
  });
  const published = useWatch({ control, name: "published" });

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField label="Step" id="step" error={errors.step?.message} {...register("step")} />
        <NumberField
          label="Order"
          id="order"
          error={errors.order?.message}
          {...register("order")}
        />
      </div>
      <TextField label="Title" id="title" error={errors.title?.message} {...register("title")} />
      <TextAreaField
        label="Description"
        id="description"
        error={errors.description?.message}
        rows={3}
        {...register("description")}
      />
      <SwitchField
        label="Published"
        description="Visible on the public site"
        checked={!!published}
        onCheckedChange={(c) => setValue("published", c)}
      />
    </FormShell>
  );
}

const testimonialSchema = z.object({
  author: requiredString,
  role: optionalString,
  company: optionalString,
  quote: requiredString,
  avatar: optionalString,
  projectId: optionalString,
  images: optionalArray,
  order: optionalNumber,
  published: optionalBool
});

export function TestimonialForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel
}: ResourceFormProps<Testimonial>) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { published: false, ...defaultValues }
  });
  const published = useWatch({ control, name: "published" });
  const avatar = useWatch({ control, name: "avatar" });
  const images = useWatch({ control, name: "images" }) as string[] | undefined;
  const projectId = useWatch({ control, name: "projectId" });
  const projects = useCollectionList("projects");
  const projectOptions = (Array.isArray(projects.data) ? projects.data : []).sort(
    (a, b) => (b.order ?? 0) - (a.order ?? 0)
  );

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <TextField
        label="Author"
        id="author"
        error={errors.author?.message}
        {...register("author")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Role" id="role" error={errors.role?.message} {...register("role")} />
        <TextField
          label="Company"
          id="company"
          error={errors.company?.message}
          {...register("company")}
        />
      </div>
      <TextAreaField
        label="Quote"
        id="quote"
        error={errors.quote?.message}
        rows={3}
        {...register("quote")}
      />
      <FilePicker
        label="Avatar"
        kind="image"
        value={avatar}
        onChange={(v) => setValue("avatar", v, { shouldDirty: true })}
        error={errors.avatar?.message}
        hint="PNG, JPG, WebP, GIF, or SVG. Max 5MB."
      />
      <div>
        <span className="mb-1.5 block text-sm font-medium">Related project</span>
        <Select
          value={projectId || "none"}
          onValueChange={(v) =>
            setValue("projectId", v === "none" ? "" : (v ?? ""), { shouldDirty: true })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a project (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No project</SelectItem>
            {projectOptions.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Shows on this review and on the project&apos;s detail page.
        </p>
      </div>
      <ImageListPicker
        label="Proof screenshots"
        value={images}
        onChange={(v) => setValue("images", v, { shouldDirty: true })}
        hint="Optional screenshots for extra trust. PNG, JPG, WebP, GIF, or SVG. Max 5MB each."
      />
      <NumberField label="Order" id="order" error={errors.order?.message} {...register("order")} />
      <SwitchField
        label="Published"
        description="Visible on the public site"
        checked={!!published}
        onCheckedChange={(c) => setValue("published", c)}
      />
    </FormShell>
  );
}

const contactSettingsSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").optional(),
  phone: optionalString,
  availability: optionalString,
  location: optionalString,
  formEnabled: optionalBool
});

export function ContactSettingsForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel
}: ResourceFormProps<ContactSettings>) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: { formEnabled: true, ...defaultValues }
  });
  const formEnabled = useWatch({ control, name: "formEnabled" });

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <TextField
        label="Email"
        id="email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Phone" id="phone" error={errors.phone?.message} {...register("phone")} />
        <TextField
          label="Location"
          id="location"
          error={errors.location?.message}
          {...register("location")}
        />
      </div>
      <TextAreaField
        label="Availability"
        id="availability"
        error={errors.availability?.message}
        rows={2}
        {...register("availability")}
      />
      <SwitchField
        label="Contact form enabled"
        description="Allow visitors to submit inquiries"
        checked={!!formEnabled}
        onCheckedChange={(c) => setValue("formEnabled", c)}
      />
    </FormShell>
  );
}

const navigationLabelsSchema = z.preprocess((v) => {
  if (!Array.isArray(v)) return v;
  const out: Record<string, string> = {};
  for (const line of v) {
    const index = line.indexOf("=");
    if (index < 0) continue;
    const key = line.slice(0, index).trim();
    const label = line.slice(index + 1).trim();
    if (key && label) out[key] = label;
  }
  return Object.keys(out).length ? out : undefined;
}, z.record(z.string(), z.string()).optional());

const sectionVisibilitySchema = z.preprocess(
  (v) => {
    if (!Array.isArray(v)) return v;
    const out: { key: string; label: string; enabled: boolean }[] = [];
    for (const line of v) {
      const parts = line.split("=").map((s: string) => s.trim());
      if (parts.length < 2 || !parts[0] || !parts[1]) continue;
      out.push({ key: parts[0], label: parts[1], enabled: parts[2] !== "false" });
    }
    return out.length ? out : undefined;
  },
  z.array(z.object({ key: z.string().min(1), label: z.string(), enabled: z.boolean() })).optional()
);

const siteSettingsSchema = z.object({
  siteName: requiredString,
  tagline: optionalString,
  navigationLabels: navigationLabelsSchema,
  sectionVisibility: sectionVisibilitySchema
});

function recordToLines(value?: Record<string, string>): string[] {
  return Object.entries(value ?? {}).map(([key, label]) => `${key} = ${label}`);
}

function sectionsToLines(value?: { key: string; label: string; enabled: boolean }[]): string[] {
  return (value ?? []).map((s) => `${s.key} = ${s.label} = ${s.enabled ? "true" : "false"}`);
}

export function SiteSettingsForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel
}: ResourceFormProps<SiteSettings>) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: defaultValues ?? {}
  });
  const navigationLabels = useWatch({ control, name: "navigationLabels" }) as
    Record<string, string> | undefined;
  const sectionVisibility = useWatch({
    control,
    name: "sectionVisibility"
  }) as { key: string; label: string; enabled: boolean }[] | undefined;

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <TextField
        label="Site name"
        id="siteName"
        error={errors.siteName?.message}
        {...register("siteName")}
      />
      <TextField
        label="Tagline"
        id="tagline"
        error={errors.tagline?.message}
        {...register("tagline")}
      />
      <ListField
        label="Navigation labels"
        hint="One per line, format: key = Label (e.g. about = About Me)"
        value={recordToLines(navigationLabels)}
        onChange={(lines) => setValue("navigationLabels", lines as never)}
      />
      <ListField
        label="Section visibility"
        hint="One per line, format: key = Label = true|false (e.g. skills = Skills = true)"
        value={sectionsToLines(sectionVisibility)}
        onChange={(lines) => setValue("sectionVisibility", lines as never)}
      />
    </FormShell>
  );
}
