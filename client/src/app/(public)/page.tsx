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

export default function PublicPage() {
  return (
    <>
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
    </>
  );
}
