export const SOCIAL_ICON_PRESETS = [
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "x", label: "X (Twitter)" },
  { key: "leetcode", label: "LeetCode" },
  { key: "stackoverflow", label: "Stack Overflow" },
  { key: "email", label: "Email" },
  { key: "website", label: "Website" },
  { key: "phone", label: "Phone" },
  { key: "upwork", label: "Upwork" },
  { key: "fiverr", label: "Fiverr" },
  { key: "freelancer", label: "Freelancer" },
  { key: "mostaql", label: "Mostaql" },
  { key: "khamsat", label: "Khamsat" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "telegram", label: "Telegram" },
  { key: "instagram", label: "Instagram" },
  { key: "dribbble", label: "Dribbble" }
] as const;

export type SocialIconKey = (typeof SOCIAL_ICON_PRESETS)[number]["key"];

export const SOCIAL_ICON_LABELS = SOCIAL_ICON_PRESETS.reduce(
  (acc, preset) => {
    acc[preset.key] = preset.label;
    return acc;
  },
  {} as Record<SocialIconKey, string>
);

export const SOCIAL_ICON_GROUPS: { group: string; keys: SocialIconKey[] }[] = [
  { group: "Recruiting", keys: ["github", "linkedin", "x", "leetcode", "stackoverflow"] },
  {
    group: "Freelance",
    keys: ["upwork", "fiverr", "freelancer", "mostaql", "khamsat", "whatsapp", "telegram"]
  },
  { group: "Contact & social", keys: ["email", "website", "phone", "instagram", "dribbble"] }
];
