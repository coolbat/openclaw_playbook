import type { Locale } from "@/config/site";

export type AdSlotKey = "home_between_sections" | "detail_sidebar" | "detail_after_content";

type AdVariant = "banner" | "card";

type AdCopy = {
  label: string;
  title: string;
  summary: string;
  ctaLabel: string;
  href: string;
};

type AdSlotConfig = {
  enabled: boolean;
  variant: AdVariant;
  content: Record<Locale, AdCopy>;
};

export const adsConfig: {
  enabled: boolean;
  provider: "custom";
  slots: Record<AdSlotKey, AdSlotConfig>;
} = {
  enabled: false,
  provider: "custom",
  slots: {
    home_between_sections: {
      enabled: false,
      variant: "banner",
      content: {
        en: {
          label: "Sponsored",
          title: "Promote one sponsor, product, or newsletter without interrupting the main learning path.",
          summary: "Best for one lightweight mention after readers scan the hero.",
          ctaLabel: "Explore the example",
          href: "/templates/",
        },
        zh: {
          label: "赞助位",
          title: "在不打断主学习路径的前提下，推广一条产品、Newsletter 或合作信息。",
          summary: "适合放一条轻量赞助或站内推广。",
          ctaLabel: "查看示例",
          href: "/templates/",
        },
      },
    },
    detail_sidebar: {
      enabled: false,
      variant: "card",
      content: {
        en: {
          label: "Sponsored",
          title: "Promote a relevant tool without interrupting reading.",
          summary: "This sidebar slot works best for workflow tools, related products, or sponsored references that match the article context.",
          ctaLabel: "View partner",
          href: "/about/",
        },
        zh: {
          label: "赞助位",
          title: "推广相关工具，但不要打断阅读路径。",
          summary: "侧栏位更适合放与当前文章相关的工具、产品或参考资源，不要抢掉正文的注意力。",
          ctaLabel: "查看合作方",
          href: "/about/",
        },
      },
    },
    detail_after_content: {
      enabled: false,
      variant: "card",
      content: {
        en: {
          label: "Sponsored",
          title: "Place post-read offers after the main answer is delivered.",
          summary: "Use this slot for a newsletter, partner recommendation, template pack, or your own next-step product after the article ends.",
          ctaLabel: "See the offer",
          href: "/about/",
        },
        zh: {
          label: "赞助位",
          title: "把推广内容放在读者看完正文之后。",
          summary: "这个位置适合放 Newsletter、合作推荐、模板包或你自己的下一步产品，不要放在正文中段打断阅读。",
          ctaLabel: "查看内容",
          href: "/about/",
        },
      },
    },
  },
};

export const isAdSlotEnabled = (slot: AdSlotKey) => adsConfig.enabled && adsConfig.slots[slot].enabled;
