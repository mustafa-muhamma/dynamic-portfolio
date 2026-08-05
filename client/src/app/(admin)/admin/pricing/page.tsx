"use client";

import { CollectionManager } from "@/components/admin/collection-manager";
import { PricingForm } from "@/components/admin/forms";

export default function PricingPage() {
  return (
    <CollectionManager
      resource="pricing"
      title="Pricing"
      description="Tiers and rates"
      Form={PricingForm}
      getLabel={(row) => row.tier}
      getSubtitle={(row) =>
        row.price != null
          ? `$${row.price}${row.period ? ` / ${row.period}` : ""}`
          : (row.period ?? "")
      }
      searchText={(row) => `${row.tier} ${row.period ?? ""}`.trim()}
    />
  );
}
