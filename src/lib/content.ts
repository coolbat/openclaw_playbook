import { getCollection, type CollectionEntry } from "astro:content";
import { defaultLocale, type Locale } from "@/config/site";

export type CollectionName = "pages" | "quickStart" | "learn" | "templates" | "troubleshoot";
type EntryWithMeta = {
  id: string;
  slug: string;
  data: {
    title?: string;
    slug?: string;
    draft?: boolean;
    publishedAt?: Date;
    updatedAt?: Date;
    category?: string;
    tags?: string[];
  };
};

const tagCollections = ["quickStart", "learn", "templates", "troubleshoot"] as const;
type TagCollectionName = (typeof tagCollections)[number];

export function slugifyTag(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\u4e00-\u9fff-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getLocalizedCollection<T extends CollectionName>(
  collection: T,
  locale: Locale,
) {
  const entries = await getCollection(collection);
  return entries.filter((entry) => {
    const normalizedId = entry.id.replace(/\\/g, "/");
    if (entry.data.draft) {
      return false;
    }
    if (locale === defaultLocale) {
      return normalizedId.startsWith("en/") || !normalizedId.startsWith("zh/");
    }
    return normalizedId.startsWith(`${locale}/`);
  });
}

export async function getEntryBySlug<T extends CollectionName>(
  collection: T,
  locale: Locale,
  slug: string,
) {
  const entries = await getLocalizedCollection(collection, locale);
  return entries.find((entry) => {
    const basename = entry.id.replace(/\\/g, "/").split("/").pop()?.replace(/\.(md|mdx)$/, "");
    return entry.slug === slug || basename === slug || (entry.data as { slug?: string }).slug === slug;
  }) as CollectionEntry<T> | undefined;
}

export function sortByTitle<T extends { data: { title: string } }>(entries: T[]) {
  return [...entries].sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export function sortByPublication<T extends EntryWithMeta>(entries: T[]) {
  return [...entries].sort((a, b) => {
    const aTime = a.data.publishedAt?.getTime() ?? 0;
    const bTime = b.data.publishedAt?.getTime() ?? 0;
    if (aTime !== bTime) {
      return bTime - aTime;
    }
    return (a.data.title ?? "").localeCompare(b.data.title ?? "");
  });
}

export function getRouteSlug(entry: { id: string; data?: { slug?: string } }) {
  return entry.data?.slug
    ?? entry.id.replace(/\\/g, "/").split("/").pop()?.replace(/\.(md|mdx)$/, "")
    ?? entry.id;
}

export function getEntryNeighbors<T extends EntryWithMeta>(entries: T[], currentEntry: T) {
  const orderedEntries = sortByPublication(entries);
  const currentSlug = getRouteSlug(currentEntry);
  const currentIndex = orderedEntries.findIndex((entry) => getRouteSlug(entry) === currentSlug);

  return {
    previous: currentIndex >= 0 ? orderedEntries[currentIndex + 1] : undefined,
    next: currentIndex > 0 ? orderedEntries[currentIndex - 1] : undefined,
  };
}

export async function getAllTagPages(locale: Locale) {
  const tagMap = new Map<string, { label: string; count: number }>();

  await Promise.all(
    tagCollections.map(async (collection) => {
      const entries = await getLocalizedCollection(collection, locale);
      entries.forEach((entry) => {
        const tags = (entry.data as { tags?: string[] }).tags ?? [];
        tags.forEach((tag) => {
          const slug = slugifyTag(tag);
          const current = tagMap.get(slug);
          tagMap.set(slug, {
            label: current?.label ?? tag,
            count: (current?.count ?? 0) + 1,
          });
        });
      });
    }),
  );

  return [...tagMap.entries()]
    .map(([slug, value]) => ({ slug, ...value }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export async function getEntriesByTag(locale: Locale, tagSlug: string) {
  const sections = await Promise.all(
    tagCollections.map(async (collection) => {
      const entries = await getLocalizedCollection(collection, locale);
      const matches = entries.filter((entry) =>
        ((entry.data as { tags?: string[] }).tags ?? []).some((tag) => slugifyTag(tag) === tagSlug),
      );
      return { collection, entries: sortByPublication(matches) };
    }),
  );

  return sections.filter((section) => section.entries.length > 0);
}

export function getUniqueCategories<T extends { data: { category?: string } }>(entries: T[]) {
  return [...new Set(entries.map((entry) => entry.data.category).filter(Boolean))] as string[];
}

export function getRelatedEntries<T extends EntryWithMeta>(entries: T[], currentEntry: T, limit = 3) {
  const currentSlug = getRouteSlug(currentEntry);
  const currentTags = new Set((currentEntry.data.tags ?? []).map((tag) => tag.toLowerCase()));
  const currentCategory = currentEntry.data.category?.toLowerCase();

  return sortByPublication(entries)
    .filter((entry) => getRouteSlug(entry) !== currentSlug)
    .map((entry) => {
      const sharedTags = (entry.data.tags ?? []).filter((tag) => currentTags.has(tag.toLowerCase())).length;
      const sameCategory = currentCategory && entry.data.category?.toLowerCase() === currentCategory ? 1 : 0;
      return { entry, score: sharedTags * 2 + sameCategory };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entry);
}

export async function getTranslationStatus<T extends CollectionName>(
  collection: T,
  locale: Locale,
  entry: CollectionEntry<T>,
) {
  const targetLocale = locale === "zh" ? "en" : "zh";
  const translatedEntry = await getEntryBySlug(collection, targetLocale, getRouteSlug(entry));

  if (!translatedEntry) {
    console.warn(`[i18n] Missing ${targetLocale} translation for ${collection}:${getRouteSlug(entry)}`);
    return { translatedEntry: undefined, status: "missing" as const };
  }

  const currentUpdated = (entry.data as { updatedAt?: Date }).updatedAt?.getTime() ?? 0;
  const translatedUpdated = (translatedEntry.data as { updatedAt?: Date }).updatedAt?.getTime() ?? 0;

  if (translatedUpdated < currentUpdated) {
    console.warn(`[i18n] Outdated ${targetLocale} translation for ${collection}:${getRouteSlug(entry)}`);
    return { translatedEntry, status: "outdated" as const };
  }

  return { translatedEntry, status: "ok" as const };
}
