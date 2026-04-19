import fs from "node:fs/promises";
import path from "node:path";

const rootDir = "/Users/coolbat/openclaw_playbook";
const metadataPath = path.join(rootDir, "src", "content", ".openclaw101-migration.json");
const targetPath = path.join(rootDir, "src", "config", "home.ts");

function q(value) {
  return JSON.stringify(value);
}

async function main() {
  const raw = await fs.readFile(metadataPath, "utf8");
  const metadata = JSON.parse(raw);

  const content = `export const homeConfig = {
  hero: {
    kicker: ${q(metadata.homeHero.kicker)},
    title: {
      en: ${q(metadata.homeHero.title.en)},
      zh: ${q(metadata.homeHero.title.zh)},
    },
    summary: {
      en: ${q(metadata.homeHero.summary.en)},
      zh: ${q(metadata.homeHero.summary.zh)},
    },
    aside: {
      en: ${q(metadata.homeHero.sideTitle.en + ": " + metadata.homeHero.sideItems.map((item) => item.en).join(" "))},
      zh: ${q(metadata.homeHero.sideTitle.zh + "：" + metadata.homeHero.sideItems.map((item) => item.zh).join(" "))},
    },
  },
  quickStartIntro: {
    title: { en: ${q(metadata.quickStartIntro.title.en)}, zh: ${q(metadata.quickStartIntro.title.zh)} },
    summary: {
      en: ${q(metadata.quickStartIntro.summary.en)},
      zh: ${q(metadata.quickStartIntro.summary.zh)},
    },
  },
  learnIntro: {
    title: { en: ${q(metadata.learnIntro.title.en)}, zh: ${q(metadata.learnIntro.title.zh)} },
    summary: {
      en: ${q(metadata.learnIntro.summary.en)},
      zh: ${q(metadata.learnIntro.summary.zh)},
    },
  },
  templatesIntro: {
    title: { en: ${q(metadata.templatesIntro.title.en)}, zh: ${q(metadata.templatesIntro.title.zh)} },
    summary: {
      en: ${q(metadata.templatesIntro.summary.en)},
      zh: ${q(metadata.templatesIntro.summary.zh)},
    },
  },
  troubleshootIntro: {
    title: { en: ${q(metadata.troubleshootIntro.title.en)}, zh: ${q(metadata.troubleshootIntro.title.zh)} },
    summary: {
      en: ${q(metadata.troubleshootIntro.summary.en)},
      zh: ${q(metadata.troubleshootIntro.summary.zh)},
    },
  },
  skillsIntro: {
    title: { en: "Skills", zh: "技能" },
    summary: {
      en: "A curated directory of starter-friendly and higher-leverage skills for OpenClaw workflows.",
      zh: "一个为 OpenClaw 工作流准备的技能目录，覆盖适合新手的起步能力和更高杠杆的进阶能力。",
    },
  },
};
`;

  await fs.writeFile(targetPath, content, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
