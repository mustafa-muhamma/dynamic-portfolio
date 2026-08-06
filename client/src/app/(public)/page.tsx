import { About } from "@/components/public/about";
import { Experience } from "@/components/public/experience";
import { Hero } from "@/components/public/hero";
import { Projects } from "@/components/public/projects";
import { Skills } from "@/components/public/skills";

export default function PublicPage() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
    </>
  );
}
