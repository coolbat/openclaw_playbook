export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const siteConfig = {
  name: "OpenClaw101",
  tagline: {
    en: "Bilingual OpenClaw tutorials from first setup to repeatable workflows.",
    zh: "从首次安装到可重复工作流的 OpenClaw 双语教程站。",
  },
  description: {
    en: "A bilingual OpenClaw learning hub covering quick start onboarding, deeper guides, starter templates, skills, and troubleshooting.",
    zh: "一个面向 OpenClaw 的双语学习站，覆盖 Quick Start、深入指南、起步模板、技能目录和排错恢复。",
  },
  domain: "https://openclaw101.space",
  socialImage: "/og-image.png",
  navigation: [
    { href: "/learn/", label: "Learn", labelZh: "学习", key: "learn" },
    { href: "/templates/", label: "Templates", labelZh: "模板", key: "templates" },
    { href: "/skills/", label: "Skills", labelZh: "技能", key: "skills" },
    { href: "/troubleshoot/", label: "Troubleshoot", labelZh: "排错", key: "troubleshoot" },
  ],
  footerLinks: [
    { href: "/about/", en: "About", zh: "关于" },
    { href: "/editorial/", en: "Editorial Policy", zh: "编辑政策" },
    { href: "/privacy/", en: "Privacy", zh: "隐私" },
    { href: "/terms/", en: "Terms", zh: "条款" },
  ],
  officialLinks: [
    { href: "https://github.com/openclaw/openclaw", label: "OpenClaw GitHub" },
  ],
};
