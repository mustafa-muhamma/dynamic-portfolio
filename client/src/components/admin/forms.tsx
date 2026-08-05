"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { FormEventHandler, ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  ListField,
  NumberField,
  SwitchField,
  TextAreaField,
  TextField
} from "@/components/admin/fields";
import type { ResourceFormProps } from "@/components/admin/collection-manager";
import { Button } from "@/components/ui/button";
import type {
  ContactSettings,
  Education,
  Experience,
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
  resume: optionalString,
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
    formState: { errors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues
  });

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
      <TextField
        label="Photo URL"
        id="photo"
        error={errors.photo?.message}
        {...register("photo")}
      />
      <TextField
        label="Resume URL"
        id="resume"
        error={errors.resume?.message}
        {...register("resume")}
      />
      <TextField
        label="Contact email"
        id="contactEmail"
        type="email"
        error={errors.contactEmail?.message}
        {...register("contactEmail")}
      />
      {isEdit ? null : (
        <p className="text-xs text-muted-foreground">Create the profile to get started.</p>
      )}
    </FormShell>
  );
}

const resumeSchema = z.object({
  fileName: requiredString,
  fileUrl: z.string().trim().url("Enter a valid URL"),
  mimeType: optionalString,
  size: optionalNumber
});

export function ResumeForm({
  defaultValues,
  submitting,
  onSubmit,
  onCancel
}: ResourceFormProps<Resume>) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues
  });

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <TextField
        label="File name"
        id="fileName"
        error={errors.fileName?.message}
        {...register("fileName")}
      />
      <TextField
        label="File URL"
        id="fileUrl"
        error={errors.fileUrl?.message}
        {...register("fileUrl")}
      />
      <TextField
        label="MIME type"
        id="mimeType"
        error={errors.mimeType?.message}
        {...register("mimeType")}
      />
      <NumberField
        label="Size (bytes)"
        id="size"
        error={errors.size?.message}
        {...register("size")}
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

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <div className="grid grid-cols-2 gap-4">
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
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Start"
          id="start"
          placeholder="2020-01"
          error={errors.start?.message}
          {...register("start")}
        />
        <TextField
          label="End"
          id="end"
          placeholder="2023-06"
          error={errors.end?.message}
          {...register("end")}
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
      <div className="grid grid-cols-2 gap-4">
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
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Start" id="start" error={errors.start?.message} {...register("start")} />
        <TextField label="End" id="end" error={errors.end?.message} {...register("end")} />
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
      <div className="grid grid-cols-2 gap-4">
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
  description: optionalString,
  role: optionalString,
  link: optionalString,
  repo: optionalString,
  technologies: optionalArray,
  images: optionalArray,
  featured: optionalBool,
  order: optionalNumber,
  published: optionalBool
});

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
    defaultValues: { featured: false, published: false, ...defaultValues }
  });
  const technologies = useWatch({ control, name: "technologies" }) as string[] | undefined;
  const images = useWatch({ control, name: "images" }) as string[] | undefined;
  const featured = useWatch({ control, name: "featured" });
  const published = useWatch({ control, name: "published" });

  return (
    <FormShell
      onSubmit={handleSubmit((v) => onSubmit(v))}
      onCancel={onCancel}
      submitting={submitting}
    >
      <TextField label="Title" id="title" error={errors.title?.message} {...register("title")} />
      <TextAreaField
        label="Description"
        id="description"
        error={errors.description?.message}
        rows={3}
        {...register("description")}
      />
      <TextField label="Role" id="role" error={errors.role?.message} {...register("role")} />
      <div className="grid grid-cols-2 gap-4">
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
      <ListField label="Image URLs" value={images} onChange={(v) => setValue("images", v)} />
      <div className="grid grid-cols-2 gap-4">
        <NumberField
          label="Order"
          id="order"
          error={errors.order?.message}
          {...register("order")}
        />
      </div>
      <SwitchField
        label="Featured"
        description="Highlight on the public site"
        checked={!!featured}
        onCheckedChange={(c) => setValue("featured", c)}
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
      <div className="grid grid-cols-2 gap-4">
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
      <div className="grid grid-cols-2 gap-4">
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
      <div className="grid grid-cols-2 gap-4">
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
      <div className="grid grid-cols-2 gap-4">
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
      <div className="grid grid-cols-2 gap-4">
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
      <TextField
        label="Avatar URL"
        id="avatar"
        error={errors.avatar?.message}
        {...register("avatar")}
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
      <div className="grid grid-cols-2 gap-4">
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
    defaultValues
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
