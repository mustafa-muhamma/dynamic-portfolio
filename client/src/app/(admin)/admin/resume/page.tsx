"use client";

import { SingletonManager } from "@/components/admin/singleton-manager";
import { ResumeForm } from "@/components/admin/forms";

export default function ResumePage() {
  return (
    <SingletonManager
      resource="resume"
      title="Resume"
      description="Downloadable resume file"
      Form={ResumeForm}
    />
  );
}
