import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { About } from "@/components/public/about";
import { Contact } from "@/components/public/contact";
import { Experience } from "@/components/public/experience";
import { Hero } from "@/components/public/hero";
import { Pricing } from "@/components/public/pricing";
import { Process } from "@/components/public/process";
import { Projects } from "@/components/public/projects";
import { Services } from "@/components/public/services";
import { Skills } from "@/components/public/skills";
import { Testimonials } from "@/components/public/testimonials";
import { getPublicBundleCached } from "@/lib/public-api-server";

export const revalidate = 60;

export default async function PublicPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["public", "bundle"],
    queryFn: getPublicBundleCached,
    retry: 1
  });

  const queryState = queryClient.getQueryState(["public", "bundle"]);
  const state = queryState?.status === "success" ? dehydrate(queryClient) : undefined;

  return (
    <HydrationBoundary state={state}>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Services />
      <Pricing />
      <Process />
      <Testimonials />
      <Contact />
    </HydrationBoundary>
  );
}
