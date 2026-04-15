# AnyPlaybook

AnyPlaybook is a bilingual Astro template for tutorial and playbook sites.

It keeps the current information architecture used in this workspace:

- `Quick Start`
- `Learn`
- `Resources`
- `Templates`
- `Troubleshoot`
- `About / Editorial / Privacy / Terms`

The goal is to provide a forkable static template for sites like:

- `openclaw101.space`
- `vibecode.wiki`
- `paperclip101.com`

## What This Template Optimizes For

- static deployment
- explicit locale routes
- stable slugs and SEO-friendly structure
- MDX-based article content
- reusable branding and theme configuration
- tutorial-site information architecture

## Stack

- Astro
- MDX
- `@astrojs/sitemap`
- static output

## Locale Model

The template uses explicit locale paths:

- English: `/`
- Chinese: `/zh/`

Examples:

- `/learn/design-onboarding-around-outcomes/`
- `/zh/learn/design-onboarding-around-outcomes/`

This avoids runtime language rewrites and keeps the site static-host friendly.

## Project Structure

```text
src/
  components/
  config/
  content/
    learn/
    pages/
    quickStart/
    templates/
    troubleshoot/
  layouts/
  lib/
  pages/
  styles/
```

## Customize First

1. Edit `src/config/site.ts`
2. Edit `src/config/home.ts`
3. Edit `src/config/ads.ts` if you want ad slots or sponsor cards
4. Replace demo content in `src/content/`
5. Update analytics, ad, and verification tags as needed
6. Set the correct production domain in `astro.config.mjs` and `src/config/site.ts`

## Configuration Guide

This template is configured in a few predictable layers. If you are forking it, most edits only need to happen in these files:

- `src/config/site.ts`: global site name, domain, nav, footer, default social image
- `src/config/home.ts`: home page hero and section copy
- `src/config/ads.ts`: global ad switch and per-slot toggles
- `src/pages/*.astro`: page-level layout decisions such as hero buttons, hero highlights, section composition
- `src/content/**`: article content and frontmatter
- `src/layouts/BaseLayout.astro`: shared navigation, theme switch, language switch, SEO metadata
- `src/styles/global.css`: visual styling only

### 广告位怎么配置

广告位配置在：

- `src/config/ads.ts`

当前支持 3 个位置：

- `home_between_sections`
- `detail_sidebar`
- `detail_after_content`

推荐理解方式：

- `enabled`: 全站总开关
- `slots.*.enabled`: 每个广告位单独开关

例如：

```ts
export const adsConfig = {
  enabled: true,
  provider: "custom",
  slots: {
    home_between_sections: { enabled: true, ... },
    detail_sidebar: { enabled: false, ... },
    detail_after_content: { enabled: true, ... },
  },
};
```

规则：

1. 总开关关掉，所有广告位都不渲染
2. 总开关打开，也只显示被单独开启的位置
3. 默认是站内推广/赞助卡模式，不绑定任何广告平台

如果你想接第三方广告脚本，建议先保留这套开关结构，再把 `AdSlot.astro` 的内容替换成你自己的平台代码。

### Hero 标签怎么配置

你问的 Hero 下面那排标签，不是从 `src/config/home.ts` 自动生成的，它们是 `PageHero` 组件的 `highlights` 属性。

组件定义在：

- `src/components/PageHero.astro`

核心接口是：

```astro
<PageHero
  kicker="STATIC PLAYBOOK TEMPLATE"
  title="..."
  summary="..."
  ctas={[...]}
  highlights={["标签 1", "标签 2", "标签 3"]}
  aside="..."
/>
```

首页当前配置位置：

- 英文首页：`src/pages/index.astro`
- 中文首页：`src/pages/zh/index.astro`

例如当前首页是这样配的：

```astro
highlights={[
  "Bilingual routing included",
  "Theme + locale controls ready",
  "Structured content collections",
]}
```

中文首页对应：

```astro
highlights={[
  "内置中英双语路由",
  "深浅色与语言切换就绪",
  "内容集合结构已整理",
]}
```

如果你想改这排标签：

1. 打开对应页面文件
2. 找到 `<PageHero ... highlights={[...]}>`
3. 直接改数组里的文案
4. 保存后刷新页面

如果你想让其他页面也出现这排标签：

1. 找到对应页面的 `PageHero`
2. 传入 `highlights={[...]}`
3. 不传则不会显示

如果你想改它的样式：

- 样式在 `src/styles/global.css`
- 相关类名：`.hero-highlights`、`.hero-highlights li`
- 深色模式单独样式：`:root[data-theme="dark"] .hero-highlights li`

### 首页 Hero 怎么配置

首页 Hero 的主文案主要分两层：

1. 文案基础配置：`src/config/home.ts`
2. 页面级交互配置：`src/pages/index.astro` 和 `src/pages/zh/index.astro`

在 `src/config/home.ts` 里改：

- `hero.kicker`
- `hero.title.en / hero.title.zh`
- `hero.summary.en / hero.summary.zh`

在首页页面文件里改：

- `ctas`: Hero 按钮
- `highlights`: Hero 标签
- `aside`: 右侧说明卡片

### 导航、站点名、页脚怎么配置

全站公共信息都在 `src/config/site.ts`：

- `name`: 左上角站点名
- `tagline`: 页脚副标题
- `description`: 默认站点描述
- `domain`: canonical、OG、sitemap 用的主域名
- `socialImage`: 默认分享图
- `navigation`: 顶部导航
- `footerLinks`: 页脚链接
- `officialLinks`: 外部官方链接

最常改的是：

```ts
navigation: [
  { href: "/learn/", label: "Learn", key: "learn" },
  { href: "/templates/", label: "Templates", key: "templates" },
]
```

改完这里以后，桌面导航和移动端抽屉都会同步更新，因为它们都走 `BaseLayout.astro` 的同一套配置。

### 深浅色模式怎么配置

主题切换逻辑在：

- `src/layouts/BaseLayout.astro`

这里负责：

- `light / dark / system` 三态切换
- `localStorage` 持久化
- 首屏内联脚本防闪烁
- 桌面和移动端主题按钮

视觉样式在：

- `src/styles/global.css`

最常改的是这些变量：

```css
:root {
  --bg: ...;
  --surface: ...;
  --text: ...;
  --brand: ...;
}

:root[data-theme="dark"] {
  --bg: ...;
  --surface: ...;
  --text: ...;
  --brand: ...;
}
```

规则建议：

1. 先改变量，不要到处改组件颜色
2. 深色模式要单独检查标签、按钮、正文、代码块的对比度
3. 如果某个元素在深色模式下需要额外处理，就像 hero 标签一样，单独补 `:root[data-theme="dark"] ...`

### 语言切换怎么配置

语言切换逻辑也在：

- `src/layouts/BaseLayout.astro`

语言路由基础配置在：

- `src/config/site.ts`
- `src/lib/i18n.ts`

当前模型是：

- 英文：`/`
- 中文：`/zh/`

内容靠 frontmatter 里的 `locale` 字段区分，例如：

```md
locale: en
```

或：

```md
locale: zh
```

如果只是替换站点内容，不需要改语言切换逻辑；只需要保证中英文文件成对存在，且文件名一致。

### 频道页 Hero 怎么配置

`Learn / Templates / Troubleshoot / Resources` 这些频道页的 Hero 都是直接写在对应页面文件里的，不走统一配置表。

例如：

- `src/pages/learn/index.astro`
- `src/pages/templates/index.astro`
- `src/pages/troubleshoot/index.astro`
- `src/pages/skills/index.astro`（前台展示为 `Resources`）
- 以及对应的 `src/pages/zh/...`

可改字段：

- `kicker`
- `title`
- `summary`
- `highlights`

### 内容 frontmatter 怎么配置

所有内容模型定义在：

- `src/content.config.ts`

当前支持这些 collection：

- `pages`
- `quickStart`
- `learn`
- `templates`
- `troubleshoot`

常用字段示例：

```md
locale: zh
title: 调研总结模板
summary: 一个把源材料整理成教程风格总结的结构化方式。
publishedAt: 2026-04-14
updatedAt: 2026-04-14
draft: false
```

各 collection 的额外字段：

- `quickStart`: `step`, `bullets`, `tags`
- `learn`: `category`, `tags`, `readingTime`
- `templates`: `category`, `difficulty`, `time`, `risk`, `channels`, `recommendedFor`
- `troubleshoot`: `category`, `symptom`, `checks`, `commonCauses`, `ctaLabel`, `ctaHref`

规则建议：

1. 中英文文件名保持一致，便于路由对齐
2. `slug` 除非你明确需要自定义，否则可以不写
3. `draft: true` 的内容不会出现在生产构建页面列表里

### 详情页上下篇导航怎么配置

上一篇 / 下一篇不是手工配置的，它是根据 collection 内内容顺序自动生成的。

逻辑在：

- `src/lib/content.ts`

详情页模板在：

- `src/pages/quick-start/[slug].astro`
- `src/pages/learn/[slug].astro`
- `src/pages/templates/[slug].astro`
- `src/pages/troubleshoot/[slug].astro`
- 以及对应的 `src/pages/zh/...`

排序依赖：

- `publishedAt`
- 标题兜底排序

如果你想影响上下篇顺序，优先改内容的 `publishedAt`。

如果你想改它的文案或样式：

- 文案：改对应详情页模板里的 `title=` 和按钮文本
- 样式：改 `src/styles/global.css` 里的 `.detail-nav` 和 `.detail-nav-link`

### SEO 和分享信息怎么配置

全站默认 SEO 输出在：

- `src/layouts/BaseLayout.astro`

默认值来源：

- `src/config/site.ts`

它会输出：

- `canonical`
- `hreflang`
- `robots`
- `theme-color`
- Open Graph
- Twitter Card
- 文章的 `publishedAt / updatedAt`

如果你只想改默认分享图，改：

```ts
socialImage: "/icon.svg"
```

如果某个页面要单独分享图，可以在对应页面传新的 `ogImage` 给 `BaseLayout`。

### 样式应该改哪里

约定是：

1. 内容和结构改 `.astro`
2. 全局视觉改 `src/styles/global.css`
3. 站点级配置改 `src/config/*.ts`
4. 文章内容改 `src/content/**`

尽量不要把“文案配置”写进 CSS，也不要把“纯样式决定”写死在内容 frontmatter 里。

## 常见改法示例

下面这些示例都可以直接照着改。

### 1. 新增一个 Hero 标签

场景：你想在首页 Hero 下面再加一个标签，比如“SEO 元信息已内置”。

编辑文件：

- `src/pages/index.astro`
- `src/pages/zh/index.astro`

英文首页：

```astro
highlights={[
  "Bilingual routing included",
  "Theme + locale controls ready",
  "Structured content collections",
  "SEO metadata included",
]}
```

中文首页：

```astro
highlights={[
  "内置中英双语路由",
  "深浅色与语言切换就绪",
  "内容集合结构已整理",
  "已内置 SEO 元信息",
]}
```

如果你只改英文页，不改中文页，那两边显示内容不会同步。

### 2. 新增一个导航项

场景：你想在顶部导航里新增一个 `Blog` 栏目。

第一步，改全局导航配置：

文件：

- `src/config/site.ts`

```ts
navigation: [
  { href: "/learn/", label: "Learn", key: "learn" },
  { href: "/templates/", label: "Templates", key: "templates" },
  { href: "/skills/", label: "Resources", key: "skills" },
  { href: "/troubleshoot/", label: "Troubleshoot", key: "troubleshoot" },
  { href: "/blog/", label: "Blog", key: "blog" },
]
```

第二步，确保真的有这个页面：

- `src/pages/blog/index.astro`
- 中文的话还要有 `src/pages/zh/blog/index.astro`

第三步，如果你希望这个栏目在该页面高亮，需要把 `BaseLayout` 的 `active` 类型和页面里的 `active="blog"` 一起补上。

如果只是加了导航配置，没有加页面文件，点击后会是 404。

### 3. 新增一篇双语文章

场景：你想在 `Learn` 里新增一篇中英文对应文章。

第一步，分别新建两个文件，文件名保持一致：

- `src/content/learn/en/how-to-design-empty-states.mdx`
- `src/content/learn/zh/how-to-design-empty-states.mdx`

英文示例：

```mdx
---
locale: en
category: UX
title: Design empty states that teach
summary: Empty states should explain the next useful action instead of only saying nothing is here.
readingTime: 6 min
publishedAt: 2026-04-15
updatedAt: 2026-04-15
draft: false
tags:
  - empty states
  - onboarding
---

## Start with the user's blocked task

Explain what the user was trying to do, then point to the next useful step.
```

中文示例：

```mdx
---
locale: zh
category: UX
title: 让空状态也能教会用户下一步
summary: 空状态不应该只告诉用户“这里还没有内容”，而应该引导下一步有价值动作。
readingTime: 6 分钟
publishedAt: 2026-04-15
updatedAt: 2026-04-15
draft: false
tags:
  - 空状态
  - 引导
---

## 先解释用户被什么卡住了

先说明用户本来想完成什么，再给出最直接的下一步动作。
```

完成后，这篇文章会自动进入：

- `/learn/` 和 `/zh/learn/` 列表页
- 对应详情页路由
- 上一篇 / 下一篇导航
- sitemap 和 SEO 元信息

### 4. 让文章暂时不显示

场景：你还没写完，但想先把文件放进仓库。

直接在 frontmatter 里加：

```md
draft: true
```

这样它不会出现在页面列表里，也不会出现在生产构建的内容输出里。

### 5. 自定义文章 URL slug

默认情况下，URL 由文件名决定。

例如：

- `src/content/learn/en/how-to-design-empty-states.mdx`

默认会生成：

- `/learn/how-to-design-empty-states/`

如果你想自定义，可以写：

```md
slug: empty-state-design
```

这样最终 URL 会变成：

- `/learn/empty-state-design/`

建议：

1. 只有确实需要时再写 `slug`
2. 中英文对应文章最好保持同一个 slug 语义
3. 已上线页面不要轻易改 slug，避免旧链接失效

### 6. 修改首页 Hero 按钮

场景：你想把首页第二个按钮从 `Browse Learn` 改成 `Open Templates`。

文件：

- `src/pages/index.astro`
- `src/pages/zh/index.astro`

英文：

```astro
ctas={[
  { href: "#quick-start", label: "Open 5-step Quick Start", variant: "primary" },
  { href: localizePath("/templates/", locale), label: "Open Templates", variant: "secondary" },
]}
```

中文：

```astro
ctas={[
  { href: "#quick-start", label: "进入 5 步 Quick Start", variant: "primary" },
  { href: localizePath("/templates/", locale), label: "打开模板库", variant: "secondary" },
]}
```

### 7. 修改主题色

场景：你想把当前暖橙色改成蓝绿色系。

文件：

- `src/styles/global.css`

至少改这几个变量：

```css
:root {
  --brand: #1f8f8a;
  --brand-strong: #166f6b;
  --brand-soft: rgba(31, 143, 138, 0.14);
}

:root[data-theme="dark"] {
  --brand: #58c7c0;
  --brand-strong: #7ed8d2;
  --brand-soft: rgba(88, 199, 192, 0.18);
}
```

改完以后，按钮、标签、主题控件激活态、详情页 chip、目录 hover 等都会一起跟着变。

### 8. 修改上一篇 / 下一篇按钮文案

场景：你不想显示 `Newer / Older`，想改成 `Next article / Previous article`。

文件：

- `src/pages/learn/[slug].astro`
- `src/pages/templates/[slug].astro`
- `src/pages/troubleshoot/[slug].astro`
- `src/pages/quick-start/[slug].astro`
- 以及对应的 `src/pages/zh/...`

例如：

```astro
{neighbors.next && (
  <a
    class="detail-nav-link"
    href={...}
    title={`Next article: ${neighbors.next.data.title}`}
  >
    Next article: {neighbors.next.data.title}
  </a>
)}
```

### 9. 新增一个页脚链接

场景：你想在页脚加一个 `Contact` 页面。

第一步，改：

- `src/config/site.ts`

```ts
footerLinks: [
  { href: "/about/", en: "About", zh: "关于" },
  { href: "/contact/", en: "Contact", zh: "联系" },
]
```

第二步，新建：

- `src/pages/contact.astro`
- `src/pages/zh/contact.astro`

否则页脚链接会存在，但页面打不开。

### 10. 构建前最常检查的 3 件事

如果你改完后页面不对，优先检查：

1. 中英文文件名是否保持一致
2. `locale` 字段有没有写错成 `cn` 或别的值
3. `src/config/site.ts` 里的链接配置，是否真的有对应页面

## Media and Embeds

The template is static-first, but works well with:

- local images
- CDN images
- hosted video players
- YouTube / Vimeo / Bilibili embeds
- iframe-based interactive learning media

For richer interactive video engines, prefer client-side embed components rather than converting the whole site to a runtime app.

## Development

```bash
npm install
ASTRO_TELEMETRY_DISABLED=1 npm run dev
```

## Build

```bash
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

构建完成后会自动运行 `Pagefind`，在 `dist/pagefind/` 下生成静态搜索索引，不需要后端服务。

## Search, Tags, and Discovery

### 静态搜索怎么工作

模板已经集成 `Pagefind`：

- 搜索页：`/search/` 和 `/zh/search/`
- 构建脚本：`package.json`
- 搜索 UI 页面：
  - `src/pages/search.astro`
  - `src/pages/zh/search.astro`

如果你要调整搜索页文案或布局，改这两个页面即可。

如果你要换搜索样式，改：

- `src/styles/global.css`

相关类名包括：

- `.search-page`
- `.search-shell`
- `.search-root`
- `.pagefind-ui`

### 标签聚合页怎么工作

内容里的 `tags` 不只是展示文本，模板会自动生成标签聚合页：

- 英文：`/tags/<tag>/`
- 中文：`/zh/tags/<tag>/`

路由文件：

- `src/pages/tags/[tag].astro`
- `src/pages/zh/tags/[tag].astro`

标签 slug 会自动从原始 tag 文案生成，不需要你手写。

例如 frontmatter：

```md
tags:
  - git basics
  - pull requests
```

就会生成：

- `/tags/git-basics/`
- `/tags/pull-requests/`

如果你想让一篇文章出现在某个标签聚合页，只需要在 frontmatter 里把该标签加进去。

### Learn / Templates 分类筛选怎么配置

`Learn` 和 `Templates` 频道页会自动读取每篇内容的 `category` 字段，并在页面顶部生成分类筛选按钮。

你不需要单独维护筛选配置，只需要写好 frontmatter：

```md
category: Workflow design
```

或：

```md
category: 工作流设计
```

相关页面：

- `src/pages/learn/index.astro`
- `src/pages/zh/learn/index.astro`
- `src/pages/templates/index.astro`
- `src/pages/zh/templates/index.astro`

如果你想控制筛选按钮顺序或文案，就改内容里的 `category`。

### 相关推荐怎么生成

详情页的“相关内容”不是手工维护的，而是自动按以下优先级生成：

1. 共享标签越多，相关性越高
2. 分类相同，会额外加权
3. 当前文章本身会被自动排除

逻辑在：

- `src/lib/content.ts`

相关函数是：

- `getRelatedEntries(...)`

如果你觉得相关推荐不够准，优先检查：

1. `tags` 是否写得太少
2. `category` 是否过于随意
3. 中英文两边是否使用了完全不同的标签体系

## Content Authoring Guide

如果你是在把这个模板 fork 成自己的教程站，先看这里：

- `docs/CONTENT_GUIDE.md`

这个文件专门回答内容作者最常见的几个问题：

- `Quick Start` 步骤应该怎么写
- `Learn` 长文适合写什么
- `Templates` 的 `difficulty / time / risk` 怎么填
- `Troubleshoot` 应该怎么从症状倒推解决方案
- 双语内容怎么保持结构一致

建议做法：

1. 先复制一个最接近的现有示例文件
2. 按 `CONTENT_GUIDE.md` 里的字段规范改 frontmatter
3. 再写正文

## Translation Parity

中英文内容仍然是两套独立的 MDX 文件，但模板现在会做两层保护：

1. 构建时，如果一篇文章找不到对应翻译，会在构建日志里输出警告
2. 详情页侧栏会显示“该页面可能未完全翻译”的提示

这套检查依赖“中英文文件名保持一致”。

例如：

- `src/content/learn/en/review-before-you-rebase.mdx`
- `src/content/learn/zh/review-before-you-rebase.mdx`

如果英文新增了文件，但中文没有同名文件：

- 构建会警告
- 中文或英文详情页会出现同步提示

如果两边都有文件，但 `updatedAt` 差距明显，也会提示可能过期。

相关逻辑在：

- `src/lib/content.ts`

相关函数：

- `getTranslationStatus(...)`

## Resources Page Positioning

`/skills` 路由现在在前台展示为 `Resources`，被定位成“可替换的资源目录示例”，不是这个模板必须保留的固定板块。

如果你的站点并不需要展示安装命令或工具生态，有两种常见改法：

1. 继续保留结构，但把内容改成资源导航、工具清单或推荐链接
2. 直接从 `src/config/site.ts` 的 `navigation` 中移除 `Resources`

相关文件：

- `src/pages/skills/index.astro`
- `src/pages/zh/skills/index.astro`
- `src/components/SkillsPanel.astro`

如果你保留这一栏，建议把它当成下列任意一种通用频道：

- 工具推荐
- 官方文档入口
- 插件与扩展目录
- 资源导航页
- 服务与集成清单

## More Practical Examples

### 11. 新增一个搜索入口

场景：你想在正文里再放一个“搜索文档”按钮。

直接链接到：

```astro
<a href="/search/">Search docs</a>
```

中文：

```astro
<a href="/zh/search/">搜索文档</a>
```

### 12. 新增一个标签并让它能被聚合

场景：你想把某篇 Learn 文章归到 `branching` 标签。

frontmatter 里直接加：

```md
tags:
  - branching
  - git review
```

改完后这篇文章会自动：

1. 在详情页显示可点击标签
2. 出现在 `/tags/branching/`
3. 参与相关推荐计算

### 13. 新增一个分类并让频道页可筛选

场景：你想给某篇 Templates 内容设成 `Incident response` 分类。

frontmatter：

```md
category: Incident response
```

改完后：

1. `Templates` 频道页顶部会自动出现这个分类筛选按钮
2. 同分类文章会归到同一筛选结果里

### 14. 检查双语内容有没有对齐

最低成本的做法：

1. 确认中英文文件名一致
2. 两边都填 `updatedAt`
3. 运行：

```bash
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

如果有缺翻译或翻译明显过期，构建日志里会出现对应 warning。

## Migration Notes

When migrating an existing tutorial site into AnyPlaybook:

1. keep existing public URLs stable
2. move articles into the matching content collection
3. preserve bilingual route parity
4. keep canonical and sitemap outputs consistent
5. only change information architecture if there is a clear SEO or UX reason
