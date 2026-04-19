import type { Locale } from "@/config/site";

export const skillsHero = {
  kicker: "CURATED SKILLS",
  title: {
    en: "Skills organized by what you want to automate.",
    zh: "按自动化目标组织的精选技能库。",
  },
  summary: {
    en: "Not a full marketplace. A curated set of skills organized by task category, with risk level and starter guidance so you can pick the right one without guessing.",
    zh: "不是全量商店，而是按任务类别精选的技能集合，附带风险等级和新手建议，让你不用猜就能选对。",
  },
};

export type SkillItem = {
  name: string;
  summary: Record<Locale, string>;
  install: string;
  risk: "Low" | "Medium" | "High";
  starter: boolean;
  useCases: Record<Locale, string[]>;
};

export type SkillGroup = {
  id: string;
  label: Record<Locale, string>;
  summary: Record<Locale, string>;
  items: SkillItem[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "research",
    label: { en: "Research", zh: "调研" },
    summary: {
      en: "Skills for collecting, summarizing, and structuring outside information.",
      zh: "用于收集、总结和结构化外部信息的技能。",
    },
    items: [
      {
        name: "web-access",
        summary: {
          en: "Open pages, inspect content, and gather current information when claims need verification.",
          zh: "打开网页、检查内容，并在需要验证时收集当前信息。",
        },
        install: "codex skill install web-access",
        risk: "Low",
        starter: true,
        useCases: {
          en: ["Competitive research", "Web fact checking"],
          zh: ["竞品调研", "网页事实核查"],
        },
      },
    ],
  },
  {
    id: "content",
    label: { en: "Content", zh: "内容" },
    summary: {
      en: "Skills for drafting, repurposing, and polishing tutorials and articles.",
      zh: "用于起草、改写和润色教程与文章的技能。",
    },
    items: [
      {
        name: "writing-workflow",
        summary: {
          en: "A structured content pipeline for long-form articles and bilingual deliverables.",
          zh: "用于长文和双语产出的结构化写作流程。",
        },
        install: "codex skill install writing-workflow",
        risk: "Low",
        starter: true,
        useCases: {
          en: ["Article drafting", "Bilingual localization"],
          zh: ["文章起草", "双语本地化"],
        },
      },
    ],
  },
];
