"use client";

import { SingletonManager } from "@/components/admin/singleton-manager";
import { ContactSettingsForm, SiteSettingsForm } from "@/components/admin/forms";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <SingletonManager
        resource="contact-settings"
        title="Contact details"
        description="Email, phone, availability, location"
        Form={ContactSettingsForm}
      />
      <SingletonManager
        resource="site-settings"
        title="Site settings"
        description="Site name, navigation labels, section visibility"
        Form={SiteSettingsForm}
      />
    </div>
  );
}
