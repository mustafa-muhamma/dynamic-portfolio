"use client";

import { CollectionManager } from "@/components/admin/collection-manager";
import { ServiceForm } from "@/components/admin/forms";

export default function ServicesPage() {
  return (
    <CollectionManager
      resource="services"
      title="Services"
      description="Offerings for freelance clients"
      Form={ServiceForm}
      getLabel={(row) => row.name}
      getSubtitle={(row) => row.description ?? ""}
      searchText={(row) => `${row.name} ${(row.deliverables ?? []).join(" ")}`.trim()}
    />
  );
}
