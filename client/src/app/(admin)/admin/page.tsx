import {
  Briefcase,
  FolderKanban,
  GraduationCap,
  Handshake,
  Inbox,
  Link2,
  ListOrdered,
  MessageSquareQuote,
  Rocket,
  Settings,
  Tag,
  User,
  Wrench,
  FileText,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MODULES: { href: string; title: string; description: string; icon: LucideIcon }[] = [
  {
    href: "/admin/profile",
    title: "Profile",
    description: "Name, title, bio, photo, resume",
    icon: User
  },
  {
    href: "/admin/experience",
    title: "Experience",
    description: "Roles and responsibilities",
    icon: Briefcase
  },
  {
    href: "/admin/hero",
    title: "Hero",
    description: "Landing hero heading and CTAs",
    icon: Rocket
  },
  {
    href: "/admin/education",
    title: "Education",
    description: "Degrees and certifications",
    icon: GraduationCap
  },
  { href: "/admin/skills", title: "Skills", description: "Categorized skill levels", icon: Wrench },
  {
    href: "/admin/projects",
    title: "Projects",
    description: "Portfolio of shipped work",
    icon: FolderKanban
  },
  {
    href: "/admin/social-links",
    title: "Social Links",
    description: "Public profile links",
    icon: Link2
  },
  {
    href: "/admin/resume",
    title: "Resume",
    description: "Downloadable resume file",
    icon: FileText
  },
  {
    href: "/admin/services",
    title: "Services",
    description: "Offerings for freelance clients",
    icon: Handshake
  },
  { href: "/admin/pricing", title: "Pricing", description: "Tiers and rates", icon: Tag },
  {
    href: "/admin/process",
    title: "Process",
    description: "How engagements work",
    icon: ListOrdered
  },
  {
    href: "/admin/testimonials",
    title: "Testimonials",
    description: "Client proof and quotes",
    icon: MessageSquareQuote
  },
  {
    href: "/admin/settings",
    title: "Contact & Settings",
    description: "Contact details and site config",
    icon: Settings
  },
  { href: "/admin/inquiries", title: "Inquiries", description: "Visitor messages", icon: Inbox }
];

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Manage every piece of content that appears on the public site.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.href} href={module.href} className="focus-visible:outline-none">
              <Card className="h-full transition-colors hover:bg-muted/40">
                <CardHeader>
                  <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-4" />
                  </div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm font-medium text-primary">
                  Manage <span aria-hidden>→</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
