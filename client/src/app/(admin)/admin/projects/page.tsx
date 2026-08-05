"use client";

import { CollectionManager } from "@/components/admin/collection-manager";
import { ProjectForm } from "@/components/admin/forms";

export default function ProjectsPage() {
  return (
    <CollectionManager
      resource="projects"
      title="Projects"
      description="Portfolio of shipped work"
      Form={ProjectForm}
      getLabel={(row) => row.title}
      getSubtitle={(row) => row.role ?? ""}
      searchText={(row) =>
        `${row.title} ${row.role ?? ""} ${(row.technologies ?? []).join(" ")}`.trim()
      }
    />
  );
}
