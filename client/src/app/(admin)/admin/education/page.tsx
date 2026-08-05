"use client";

import { CollectionManager } from "@/components/admin/collection-manager";
import { EducationForm } from "@/components/admin/forms";

export default function EducationPage() {
  return (
    <CollectionManager
      resource="education"
      title="Education"
      description="Degrees and certifications"
      Form={EducationForm}
      getLabel={(row) => row.degree}
      getSubtitle={(row) => row.school}
      searchText={(row) => `${row.degree} ${row.school ?? ""}`.trim()}
    />
  );
}
