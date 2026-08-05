"use client";

import {
  Briefcase,
  FolderKanban,
  GraduationCap,
  Handshake,
  Inbox,
  LayoutDashboard,
  Link2,
  ListOrdered,
  LogOut,
  Menu,
  MessageSquareQuote,
  Rocket,
  Settings,
  Tag,
  User,
  Wrench,
  FileText,
  X,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Overview", icon: LayoutDashboard }]
  },
  {
    title: "Recruiter",
    items: [
      { href: "/admin/profile", label: "Profile", icon: User },
      { href: "/admin/hero", label: "Hero", icon: Rocket },
      { href: "/admin/experience", label: "Experience", icon: Briefcase },
      { href: "/admin/education", label: "Education", icon: GraduationCap },
      { href: "/admin/skills", label: "Skills", icon: Wrench },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/social-links", label: "Social Links", icon: Link2 },
      { href: "/admin/resume", label: "Resume", icon: FileText }
    ]
  },
  {
    title: "Client",
    items: [
      { href: "/admin/services", label: "Services", icon: Handshake },
      { href: "/admin/pricing", label: "Pricing", icon: Tag },
      { href: "/admin/process", label: "Process", icon: ListOrdered },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote }
    ]
  },
  {
    title: "System",
    items: [
      { href: "/admin/settings", label: "Contact & Settings", icon: Settings },
      { href: "/admin/inquiries", label: "Inquiries", icon: Inbox }
    ]
  }
];

function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start gap-2">
      <LogOut className="size-4" />
      Sign out
    </Button>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-2 pb-4">
      {NAV_SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">{section.title}</p>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    active && "bg-muted font-medium text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="px-4 py-4">
      <p className="text-sm font-semibold">Dashboard</p>
    </div>
  );
}

export function AdminNav() {
  return (
    <aside className="hidden h-full w-56 shrink-0 flex-col border-r bg-muted/30 md:flex">
      <Brand />
      <NavLinks />
      <div className="border-t p-2">
        <LogoutButton />
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Open menu"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-64 max-w-[80vw] flex-col border-r bg-background">
            <div className="flex items-center justify-between pr-2">
              <Brand />
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <div className="border-t p-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
