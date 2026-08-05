"use client";

import { CollectionManager } from "@/components/admin/collection-manager";
import { ExperienceForm } from "@/components/admin/forms";

export default function ExperiencePage() {
  return (
    <CollectionManager
      resource="experience"
      title="Experience"
      description="Roles and responsibilities"
      Form={ExperienceForm}
      getLabel={(row) => row.role}
      getSubtitle={(row) => row.company}
      searchText={(row) => `${row.role} ${row.company ?? ""} ${row.location ?? ""}`.trim()}
    />
  );
}
