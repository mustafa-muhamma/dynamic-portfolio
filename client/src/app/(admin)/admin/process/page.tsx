"use client";

import { CollectionManager } from "@/components/admin/collection-manager";
import { ProcessForm } from "@/components/admin/forms";

export default function ProcessPage() {
  return (
    <CollectionManager
      resource="process"
      title="Process"
      description="How engagements work"
      Form={ProcessForm}
      getLabel={(row) => row.title}
      getSubtitle={(row) => `Step ${row.step}`}
      searchText={(row) => `${row.title} step ${row.step}`}
    />
  );
}
