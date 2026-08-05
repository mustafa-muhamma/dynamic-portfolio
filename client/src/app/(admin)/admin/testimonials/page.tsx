"use client";

import { CollectionManager } from "@/components/admin/collection-manager";
import { TestimonialForm } from "@/components/admin/forms";

export default function TestimonialsPage() {
  return (
    <CollectionManager
      resource="testimonials"
      title="Testimonials"
      description="Client proof and quotes"
      Form={TestimonialForm}
      getLabel={(row) => row.author}
      getSubtitle={(row) => [row.role, row.company].filter(Boolean).join(", ")}
      searchText={(row) => `${row.author} ${row.role ?? ""} ${row.company ?? ""}`.trim()}
    />
  );
}
