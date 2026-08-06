import { Footer } from "@/components/public/footer";
import { Nav } from "@/components/public/nav";
import { ScrollProgress } from "@/components/public/scroll-progress";
import { SiteLoader } from "@/components/public/site-loader";
import { ThemeProvider } from "@/lib/theme";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="relative flex min-h-dvh flex-col">
        <SiteLoader />
        <ScrollProgress />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
