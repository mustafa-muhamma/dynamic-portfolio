"use client";

import { CollectionManager } from "@/components/admin/collection-manager";
import { SocialLinkForm } from "@/components/admin/forms";

export default function SocialLinksPage() {
  return (
    <CollectionManager
      resource="social-links"
      title="Social Links"
      description="Public profile links"
      Form={SocialLinkForm}
      getLabel={(row) => row.platform}
      getSubtitle={(row) => row.url}
      getImages={(row) => (row.iconUrl ? [row.iconUrl] : [])}
      searchText={(row) => `${row.platform} ${row.url}`}
    />
  );
}
