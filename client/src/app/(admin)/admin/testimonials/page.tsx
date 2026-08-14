"use client";

import { CollectionManager } from "@/components/admin/collection-manager";
import { TestimonialForm } from "@/components/admin/forms";
import { galleryImageUrls } from "@/lib/images";

export default function TestimonialsPage() {
  return (
    <CollectionManager
      resource="testimonials"
      title="Testimonials"
      description="Client proof and quotes"
      Form={TestimonialForm}
      getLabel={(row) => row.author?.trim() || "Client"}
      getSubtitle={(row) => [row.role, row.company].filter(Boolean).join(", ")}
      getImages={(row) => [...galleryImageUrls(row.images), ...(row.avatar ? [row.avatar] : [])]}
      searchText={(row) => `${row.author ?? ""} ${row.role ?? ""} ${row.company ?? ""}`.trim()}
    />
  );
}
