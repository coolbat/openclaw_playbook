export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const siteConfig = {
  name: "AnyPlaybook",
  tagline: {
    en: "Static tutorial site template for product playbooks.",
    zh: "用于产品教程站和 playbook 站点的静态模板。",
  },
  description: {
    en: "A bilingual Astro template for quick-start tutorials, learning hubs, template libraries, resource directories, and troubleshooting guides.",
    zh: "一个双语 Astro 模板，用于构建 Quick Start、Learn、Templates、Resources 和 Troubleshoot 结构的教程站。",
  },
  domain: "https://example.anyplaybook.dev",
  socialImage: "/icon.svg",
  navigation: [
    { href: "/learn/", label: "Learn", key: "learn" },
    { href: "/templates/", label: "Templates", key: "templates" },
    { href: "/skills/", label: "Resources", key: "skills" },
    { href: "/troubleshoot/", label: "Troubleshoot", key: "troubleshoot" },
  ],
  footerLinks: [
    { href: "/about/", en: "About", zh: "关于" },
    { href: "/editorial/", en: "Editorial Policy", zh: "编辑政策" },
    { href: "/privacy/", en: "Privacy", zh: "隐私" },
    { href: "/terms/", en: "Terms", zh: "条款" },
  ],
  officialLinks: [
    { href: "https://github.com/your-org/anyplaybook", label: "GitHub" },
  ],
};
