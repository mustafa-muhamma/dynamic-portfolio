"use client";

import { SingletonManager } from "@/components/admin/singleton-manager";
import { ProfileForm } from "@/components/admin/forms";

export default function ProfilePage() {
  return (
    <SingletonManager
      resource="profile"
      title="Profile"
      description="Name, title, bio, photo, resume"
      Form={ProfileForm}
      getImages={(doc) => (doc.photo ? [doc.photo] : [])}
    />
  );
}
