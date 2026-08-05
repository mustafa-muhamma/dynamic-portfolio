"use client";

import { CollectionManager } from "@/components/admin/collection-manager";
import { SkillForm } from "@/components/admin/forms";

export default function SkillsPage() {
  return (
    <CollectionManager
      resource="skills"
      title="Skills"
      description="Categorized skill levels"
      Form={SkillForm}
      getLabel={(row) => row.name}
      getSubtitle={(row) => `${row.category ?? "General"} · Level ${row.level}`}
      searchText={(row) => `${row.name} ${row.category ?? ""}`.trim()}
    />
  );
}
