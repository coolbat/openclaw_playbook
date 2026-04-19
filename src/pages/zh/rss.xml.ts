import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { siteConfig } from "@/config/site";
import { getLocalizedCollection, getRouteSlug, sortByPublication } from "@/lib/content";

export async function GET(context: APIContext) {
  const learn = await getLocalizedCollection("learn", "zh");
  const templates = await getLocalizedCollection("templates", "zh");
  const troubleshoot = await getLocalizedCollection("troubleshoot", "zh");

  const allEntries = sortByPublication([
    ...learn.map((e) => ({ ...e, _section: "learn" })),
    ...templates.map((e) => ({ ...e, _section: "templates" })),
    ...troubleshoot.map((e) => ({ ...e, _section: "troubleshoot" })),
  ]);

  return rss({
    title: `${siteConfig.name} — ${siteConfig.tagline.zh}`,
    description: siteConfig.description.zh,
    site: siteConfig.domain,
    items: allEntries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.publishedAt ?? entry.data.updatedAt,
      link: `/zh/${(entry as any)._section}/${getRouteSlug(entry)}/`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}
