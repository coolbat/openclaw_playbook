import { cpSync, mkdirSync, rmSync } from "node:fs";

const source = "dist/pagefind";
const target = "public/pagefind";

rmSync(target, { recursive: true, force: true });
mkdirSync("public", { recursive: true });
cpSync(source, target, { recursive: true });

console.log(`Synced Pagefind assets from ${source} to ${target}`);
