import fs from "node:fs/promises";
import path from "node:path";

const rootDir = "/Users/coolbat/openclaw_playbook";
const sourceDir = "/Users/coolbat/openclaw101";
const targetContentDir = path.join(rootDir, "src", "content");

function preprocessTsModule(source) {
  return source
    .replace(/^import .*$/gm, "")
    .replace(/export type[\s\S]*?\n};\n/g, "")
    .replace(/export const /g, "const ")
    .replace(/const (\w+)\s*:\s*[^=]+=/g, "const $1 =")
    .replace(/\s+as const/g, "")
    .replace(/\s+satisfies [^,\n]+(?=,)/g, "")
    .replace(/\s+satisfies [^;\n]+/g, "");
}

async function loadTsExports(relativePath, exportNames) {
  const filePath = path.join(sourceDir, relativePath);
  const raw = await fs.readFile(filePath, "utf8");
  const prepared = preprocessTsModule(raw);
  const factory = new Function(`${prepared}\nreturn { ${exportNames.join(", ")} };`);
  return factory();
}

function formatDate(value) {
  return value.toISOString().slice(0, 10);
}

function quoteString(value) {
  return JSON.stringify(value);
}

function formatArray(values) {
  if (!values || values.length === 0) {
    return "[]";
  }
  return `[\n${values.map((value) => `  ${quoteString(value)}`).join(",\n")}\n]`;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n*/);
  if (!match) {
    return { data: {}, body: raw };
  }

  const data = {};
  for (const line of match[1].split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex < 0) {
      continue;
    }
    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { data, body: raw.slice(match[0].length) };
}

const pageMetadata = {
  about: {
    en: {
      title: "About OpenClaw101",
      summary: "What this site covers, what it does not try to be, and how often the content is maintained.",
    },
    zh: {
      title: "关于 OpenClaw101",
      summary: "说明这个站点覆盖什么、不试图做什么，以及内容大致会在什么情况下更新。",
    },
  },
  privacy: {
    en: {
      title: "Privacy",
      summary: "What the site stores locally today and what it does not currently collect.",
    },
    zh: {
      title: "隐私",
      summary: "说明站点当前会在本地保存什么，以及暂时不收集哪些信息。",
    },
  },
  terms: {
    en: {
      title: "Terms",
      summary: "Scope, expectations, and boundaries for using this informational OpenClaw learning site.",
    },
    zh: {
      title: "条款",
      summary: "说明这个 OpenClaw 信息站的使用范围、预期和边界。",
    },
  },
  editorial: {
    en: {
      title: "Editorial Policy",
      summary: "How this site updates guidance when onboarding paths, terminology, or recommended workflows change.",
    },
    zh: {
      title: "编辑政策",
      summary: "说明当上手路径、术语或推荐工作流变化时，这个站点会怎样更新内容。",
    },
  },
};

function replaceCallouts(content) {
  return content.replace(/<Callout title="([^"]+)">\s*([\s\S]*?)\s*<\/Callout>/g, (_, title, body) => {
    const lines = body
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const quoteLines = [`> **${title}**`, ">"];
    for (const line of lines) {
      quoteLines.push(`> ${line}`);
    }
    return quoteLines.join("\n");
  });
}

async function emptyDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  await Promise.all(entries.map((entry) => fs.rm(path.join(dirPath, entry.name), { recursive: true, force: true })));
}

function createQuickStartMeta(entries) {
  const meta = new Map();
  for (const entry of entries) {
    meta.set(entry.slug, {
      step: entry.step,
      bullets: {
        en: entry.bullets.en,
        zh: entry.bullets.zh,
      },
    });
  }
  return meta;
}

function createLearnMeta(tabs) {
  const meta = new Map();
  for (const tab of tabs) {
    for (const tutorial of tab.tutorials) {
      meta.set(tutorial.slug, {
        category: {
          en: tab.label.en,
          zh: tab.label.zh,
        },
        tags: {
          en: tutorial.tags.en,
          zh: tutorial.tags.zh,
        },
      });
    }
  }
  return meta;
}

function createTemplateMeta(tabs) {
  const meta = new Map();
  for (const tab of tabs) {
    for (const template of tab.templates) {
      meta.set(template.slug, {
        category: {
          en: tab.label.en,
          zh: tab.label.zh,
        },
        difficulty: {
          en: template.difficulty.en,
          zh: template.difficulty.zh,
        },
        time: {
          en: template.time.en,
          zh: template.time.zh,
        },
        risk: {
          en: template.risk.en,
          zh: template.risk.zh,
        },
        channels: {
          en: template.channels.en,
          zh: template.channels.zh,
        },
        recommendedFor: {
          en: template.recommendedFor.en,
          zh: template.recommendedFor.zh,
        },
        tags: {
          en: template.tags.en,
          zh: template.tags.zh,
        },
      });
    }
  }
  return meta;
}

function createTroubleshootMeta(tabs) {
  const meta = new Map();
  for (const tab of tabs) {
    for (const entry of tab.entries) {
      meta.set(entry.slug, {
        category: {
          en: tab.label.en,
          zh: tab.label.zh,
        },
        symptom: {
          en: entry.symptom.en,
          zh: entry.symptom.zh,
        },
        checks: {
          en: entry.checks.en,
          zh: entry.checks.zh,
        },
        commonCauses: {
          en: entry.commonCauses.en,
          zh: entry.commonCauses.zh,
        },
      });
    }
  }
  return meta;
}

async function statDate(filePath) {
  const stats = await fs.stat(filePath);
  const created = stats.birthtime instanceof Date && !Number.isNaN(stats.birthtime.getTime())
    ? stats.birthtime
    : stats.mtime;
  return {
    publishedAt: formatDate(created),
    updatedAt: formatDate(stats.mtime),
  };
}

function joinBody(content) {
  return content.startsWith("\n") ? content : `\n${content}`;
}

async function writeMdxFile(filePath, frontmatterLines, body) {
  const frontmatter = ["---", ...frontmatterLines, "---"].join("\n");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${frontmatter}${joinBody(body)}`, "utf8");
}

async function migratePages() {
  await emptyDirectory(path.join(targetContentDir, "pages"));
  const locales = ["en", "zh"];
  for (const locale of locales) {
    const sourceLocaleDir = path.join(sourceDir, "content", "pages", locale);
    const filenames = await fs.readdir(sourceLocaleDir);
    for (const filename of filenames) {
      const slug = filename.replace(/\.mdx$/, "");
      const sourceFile = path.join(sourceLocaleDir, filename);
      const targetFile = path.join(targetContentDir, "pages", locale, filename);
      const raw = await fs.readFile(sourceFile, "utf8");
      const { data, body } = parseFrontmatter(raw);
      const dates = await statDate(sourceFile);
      const fallback = pageMetadata[slug]?.[locale] ?? { title: slug, summary: "" };
      await writeMdxFile(
        targetFile,
        [
          `locale: ${locale}`,
          `title: ${quoteString(data.title ?? fallback.title)}`,
          `summary: ${quoteString(data.summary ?? fallback.summary)}`,
          `publishedAt: ${dates.publishedAt}`,
          `updatedAt: ${dates.updatedAt}`,
        ],
        replaceCallouts(body),
      );
    }
  }
}

async function migrateQuickStart(quickStartMeta) {
  await emptyDirectory(path.join(targetContentDir, "quickStart"));
  for (const locale of ["en", "zh"]) {
    const sourceLocaleDir = path.join(sourceDir, "content", "quick-start", locale);
    const filenames = await fs.readdir(sourceLocaleDir);
    for (const filename of filenames) {
      const slug = filename.replace(/\.mdx$/, "");
      const sourceFile = path.join(sourceLocaleDir, filename);
      const targetFile = path.join(targetContentDir, "quickStart", locale, filename);
      const raw = await fs.readFile(sourceFile, "utf8");
      const { data, body } = parseFrontmatter(raw);
      const meta = quickStartMeta.get(slug);
      const dates = await statDate(sourceFile);

      await writeMdxFile(
        targetFile,
        [
          `locale: ${locale}`,
          `publishedAt: ${dates.publishedAt}`,
          `updatedAt: ${dates.updatedAt}`,
          `step: ${quoteString(meta?.step ?? slug)}`,
          `title: ${quoteString(data.title ?? "")}`,
          `summary: ${quoteString(data.summary ?? "")}`,
          data.readingTime ? `readingTime: ${quoteString(data.readingTime)}` : "",
          `bullets: ${formatArray(meta?.bullets?.[locale] ?? [])}`,
          "tags: []",
        ].filter(Boolean),
        body,
      );
    }
  }
}

async function migrateLearn(learnMeta) {
  await emptyDirectory(path.join(targetContentDir, "learn"));
  for (const locale of ["en", "zh"]) {
    const sourceLocaleDir = path.join(sourceDir, "content", "learn", locale);
    const filenames = await fs.readdir(sourceLocaleDir);
    for (const filename of filenames) {
      const slug = filename.replace(/\.mdx$/, "");
      const sourceFile = path.join(sourceLocaleDir, filename);
      const targetFile = path.join(targetContentDir, "learn", locale, filename);
      const raw = await fs.readFile(sourceFile, "utf8");
      const { data, body } = parseFrontmatter(raw);
      const meta = learnMeta.get(slug);
      const dates = await statDate(sourceFile);

      await writeMdxFile(
        targetFile,
        [
          `locale: ${locale}`,
          `publishedAt: ${dates.publishedAt}`,
          `updatedAt: ${dates.updatedAt}`,
          `category: ${quoteString(meta?.category?.[locale] ?? "Learn")}`,
          `title: ${quoteString(data.title ?? "")}`,
          `summary: ${quoteString(data.summary ?? "")}`,
          data.readingTime ? `readingTime: ${quoteString(data.readingTime)}` : "",
          `tags: ${formatArray(meta?.tags?.[locale] ?? [])}`,
        ],
        body,
      );
    }
  }
}

async function migrateTemplates(templateMeta) {
  await emptyDirectory(path.join(targetContentDir, "templates"));
  for (const locale of ["en", "zh"]) {
    const sourceLocaleDir = path.join(sourceDir, "content", "template-library", locale);
    const filenames = await fs.readdir(sourceLocaleDir);
    for (const filename of filenames) {
      const slug = filename.replace(/\.mdx$/, "");
      const sourceFile = path.join(sourceLocaleDir, filename);
      const targetFile = path.join(targetContentDir, "templates", locale, filename);
      const raw = await fs.readFile(sourceFile, "utf8");
      const { data, body } = parseFrontmatter(raw);
      const meta = templateMeta.get(slug);
      const dates = await statDate(sourceFile);

      await writeMdxFile(
        targetFile,
        [
          `locale: ${locale}`,
          `publishedAt: ${dates.publishedAt}`,
          `updatedAt: ${dates.updatedAt}`,
          `category: ${quoteString(meta?.category?.[locale] ?? "Templates")}`,
          `title: ${quoteString(data.title ?? "")}`,
          `summary: ${quoteString(data.summary ?? "")}`,
          data.readingTime ? `readingTime: ${quoteString(data.readingTime)}` : "",
          `difficulty: ${quoteString(meta?.difficulty?.[locale] ?? (locale === "zh" ? "入门" : "Beginner"))}`,
          `time: ${quoteString(meta?.time?.[locale] ?? (locale === "zh" ? "15 分钟" : "15 min"))}`,
          `risk: ${quoteString(meta?.risk?.[locale] ?? (locale === "zh" ? "低风险" : "Low risk"))}`,
          `channels: ${formatArray(meta?.channels?.[locale] ?? [])}`,
          `recommendedFor: ${quoteString(meta?.recommendedFor?.[locale] ?? data.summary ?? "")}`,
          `tags: ${formatArray(meta?.tags?.[locale] ?? [])}`,
        ],
        body,
      );
    }
  }
}

async function migrateTroubleshoot(troubleshootMeta) {
  await emptyDirectory(path.join(targetContentDir, "troubleshoot"));
  for (const locale of ["en", "zh"]) {
    const sourceLocaleDir = path.join(sourceDir, "content", "troubleshoot-library", locale);
    const filenames = await fs.readdir(sourceLocaleDir);
    for (const filename of filenames) {
      const slug = filename.replace(/\.mdx$/, "");
      const sourceFile = path.join(sourceLocaleDir, filename);
      const targetFile = path.join(targetContentDir, "troubleshoot", locale, filename);
      const raw = await fs.readFile(sourceFile, "utf8");
      const { data, body } = parseFrontmatter(raw);
      const meta = troubleshootMeta.get(slug);
      const dates = await statDate(sourceFile);

      await writeMdxFile(
        targetFile,
        [
          `locale: ${locale}`,
          `publishedAt: ${dates.publishedAt}`,
          `updatedAt: ${dates.updatedAt}`,
          `category: ${quoteString(meta?.category?.[locale] ?? "Troubleshoot")}`,
          `title: ${quoteString(data.title ?? "")}`,
          `summary: ${quoteString(data.summary ?? "")}`,
          `symptom: ${quoteString(meta?.symptom?.[locale] ?? data.summary ?? "")}`,
          data.readingTime ? `readingTime: ${quoteString(data.readingTime)}` : "",
          "tags: []",
          `checks: ${formatArray(meta?.checks?.[locale] ?? [])}`,
          `commonCauses: ${formatArray(meta?.commonCauses?.[locale] ?? [])}`,
          `ctaLabel: ${quoteString(locale === "zh" ? "继续排查" : "Continue")}`,
          `ctaHref: ${quoteString(locale === "zh" ? "/zh/learn/" : "/learn/")}`,
        ],
        body,
      );
    }
  }
}

async function main() {
  const { quickStartEntries, homeHero, quickStartIntro } = await loadTsExports("content/site.ts", [
    "quickStartEntries",
    "homeHero",
    "quickStartIntro",
  ]);
  const { learnTabs, learnIntro } = await loadTsExports("content/learn.ts", ["learnTabs", "learnIntro"]);
  const { templateTabs, templatesIntro } = await loadTsExports("content/templates.ts", ["templateTabs", "templatesIntro"]);
  const { troubleshootTabs, troubleshootIntro } = await loadTsExports("content/troubleshoot.ts", [
    "troubleshootTabs",
    "troubleshootIntro",
  ]);

  await migratePages();
  await migrateQuickStart(createQuickStartMeta(quickStartEntries));
  await migrateLearn(createLearnMeta(learnTabs));
  await migrateTemplates(createTemplateMeta(templateTabs));
  await migrateTroubleshoot(createTroubleshootMeta(troubleshootTabs));

  const metadataPath = path.join(rootDir, "src", "content", ".openclaw101-migration.json");
  await fs.writeFile(
    metadataPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceDir,
        homeHero,
        quickStartIntro,
        learnIntro,
        templatesIntro,
        troubleshootIntro,
      },
      null,
      2,
    ),
    "utf8",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
