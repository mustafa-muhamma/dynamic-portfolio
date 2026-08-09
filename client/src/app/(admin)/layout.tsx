import Link from "next/link";

import { AdminNav, MobileNav } from "@/components/admin/admin-nav";
import { InquiryAlert } from "@/components/admin/inquiry-alert";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <AdminNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b px-4 md:px-6">
          <div className="flex items-center gap-2">
            <MobileNav />
            <p className="text-sm font-medium">Content management</p>
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            View site
          </Link>
        </header>
        <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
      <InquiryAlert />
    </div>
  );
}
