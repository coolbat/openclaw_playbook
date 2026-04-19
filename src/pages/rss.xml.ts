import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { siteConfig } from "@/config/site";
import { getLocalizedCollection, getRouteSlug, sortByPublication } from "@/lib/content";

export async function GET(context: APIContext) {
  const learn = await getLocalizedCollection("learn", "en");
  const templates = await getLocalizedCollection("templates", "en");
  const troubleshoot = await getLocalizedCollection("troubleshoot", "en");

  const allEntries = sortByPublication([
    ...learn.map((e) => ({ ...e, _section: "learn" })),
    ...templates.map((e) => ({ ...e, _section: "templates" })),
    ...troubleshoot.map((e) => ({ ...e, _section: "troubleshoot" })),
  ]);

  return rss({
    title: `${siteConfig.name} — ${siteConfig.tagline.en}`,
    description: siteConfig.description.en,
    site: siteConfig.domain,
    items: allEntries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.publishedAt ?? entry.data.updatedAt,
      link: `/${(entry as any)._section}/${getRouteSlug(entry)}/`,
    })),
    customData: `<language>en</language>`,
  });
}
