import type { Dictionary } from "@/i18n/dictionaries/en";

// The editable copy fields for the main marketing pages. `resolve` reads the
// current dictionary default (per locale) so an unset override falls back to
// it; `label` names the field in the master editor. Adding a field here makes
// it editable — no schema change needed.
export type CopyGroup = "home" | "about" | "contact";

export type CopyItem = {
  key: string;
  group: CopyGroup;
  label: string;
  multiline?: boolean;
  resolve: (d: Dictionary) => string;
};

export const COPY_ITEMS: CopyItem[] = [
  // Home — hero
  {
    key: "home.heroEyebrow",
    group: "home",
    label: "Hero eyebrow",
    resolve: (d) => d.home.heroEyebrow,
  },
  {
    key: "home.heroTitleBefore",
    group: "home",
    label: "Hero title (lead)",
    resolve: (d) => d.home.heroTitleBefore,
  },
  {
    key: "home.heroTitleHighlight",
    group: "home",
    label: "Hero title (highlight)",
    resolve: (d) => d.home.heroTitleHighlight,
  },
  {
    key: "home.heroBody",
    group: "home",
    label: "Hero body",
    multiline: true,
    resolve: (d) => d.home.heroBody,
  },
  // About
  {
    key: "about.eyebrow",
    group: "about",
    label: "Eyebrow",
    resolve: (d) => d.about.eyebrow,
  },
  {
    key: "about.title",
    group: "about",
    label: "Title",
    resolve: (d) => d.about.title,
  },
  {
    key: "about.intro",
    group: "about",
    label: "Intro",
    multiline: true,
    resolve: (d) => d.about.intro,
  },
  // Contact
  {
    key: "contact.eyebrow",
    group: "contact",
    label: "Eyebrow",
    resolve: (d) => d.contact.eyebrow,
  },
  {
    key: "contact.titleBefore",
    group: "contact",
    label: "Title (lead)",
    resolve: (d) => d.contact.titleBefore,
  },
  {
    key: "contact.titleHighlight",
    group: "contact",
    label: "Title (highlight)",
    resolve: (d) => d.contact.titleHighlight,
  },
  {
    key: "contact.body",
    group: "contact",
    label: "Body",
    multiline: true,
    resolve: (d) => d.contact.body,
  },
];

export const COPY_GROUPS: CopyGroup[] = ["home", "about", "contact"];
