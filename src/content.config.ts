import { defineCollection, z } from "astro:content";

const pageSchema = z.object({
  locale: z.enum(["en", "zh"]),
  slug: z.string().optional(),
  draft: z.boolean().default(false),
  title: z.string(),
  summary: z.string(),
  updatedAt: z.coerce.date().optional(),
});

const quickStartSchema = z.object({
  locale: z.enum(["en", "zh"]),
  slug: z.string().optional(),
  draft: z.boolean().default(false),
  step: z.string(),
  title: z.string(),
  summary: z.string(),
  readingTime: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bullets: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

const learnSchema = z.object({
  locale: z.enum(["en", "zh"]),
  slug: z.string().optional(),
  draft: z.boolean().default(false),
  category: z.string(),
  title: z.string(),
  summary: z.string(),
  readingTime: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
});

const templateSchema = z.object({
  locale: z.enum(["en", "zh"]),
  slug: z.string().optional(),
  draft: z.boolean().default(false),
  category: z.string(),
  title: z.string(),
  summary: z.string(),
  readingTime: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  difficulty: z.string(),
  time: z.string(),
  risk: z.string(),
  channels: z.array(z.string()).default([]),
  recommendedFor: z.string(),
  tags: z.array(z.string()).default([]),
});

const troubleshootSchema = z.object({
  locale: z.enum(["en", "zh"]),
  slug: z.string().optional(),
  draft: z.boolean().default(false),
  category: z.string(),
  title: z.string(),
  summary: z.string(),
  symptom: z.string(),
  readingTime: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  checks: z.array(z.string()).default([]),
  commonCauses: z.array(z.string()).default([]),
  ctaLabel: z.string().default("Continue"),
  ctaHref: z.string().default("/learn"),
});

export const collections = {
  pages: defineCollection({ type: "content", schema: pageSchema }),
  quickStart: defineCollection({ type: "content", schema: quickStartSchema }),
  learn: defineCollection({ type: "content", schema: learnSchema }),
  templates: defineCollection({ type: "content", schema: templateSchema }),
  troubleshoot: defineCollection({ type: "content", schema: troubleshootSchema }),
};
