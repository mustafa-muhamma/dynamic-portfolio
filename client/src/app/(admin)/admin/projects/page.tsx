"use client";

import { CollectionManager } from "@/components/admin/collection-manager";
import { ProjectForm } from "@/components/admin/forms";
import { Badge } from "@/components/ui/badge";
import { galleryImageUrls } from "@/lib/images";

export default function ProjectsPage() {
  return (
    <CollectionManager
      resource="projects"
      title="Projects"
      description="Portfolio of shipped work"
      Form={ProjectForm}
      getLabel={(row) => row.title}
      getSubtitle={(row) => row.role ?? ""}
      getImages={(row) => galleryImageUrls(row.images)}
      searchText={(row) =>
        `${row.title} ${row.slug ?? ""} ${row.role ?? ""} ${(row.technologies ?? []).join(" ")}`.trim()
      }
      extraStatus={(row) => (row.inProgress ? <Badge variant="outline">In progress</Badge> : null)}
    />
  );
}
