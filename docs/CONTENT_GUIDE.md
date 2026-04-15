# Content Guide

This file is for people forking the template and writing their own content.

## Quick Start

Use `quickStart` for a guided sequence that gets a reader to one concrete outcome quickly.

Recommended shape:

1. One step = one irreversible user action or one verification checkpoint
2. Keep the title action-oriented
3. Use `bullets` for the 2-3 things the reader must remember

Recommended frontmatter:

```md
step: Step 2
title: Install Git and authenticate once
summary: Show one reliable install path plus the first auth check that proves the developer can work safely.
readingTime: 8 min
bullets:
  - Give one install path first
  - Verify identity and auth
  - List the first two common failures
tags:
  - setup
  - onboarding
```

## Learn

Use `learn` for conceptual or strategic content.

Recommended shape:

1. Explain why the pattern matters
2. Name one principle clearly
3. End with what readers should do differently next time

Recommended frontmatter:

```md
category: Workflow Design
title: Keep early Git workflows small
summary: Small workflows are easier to review, debug, and repeat across teams.
readingTime: 7 min
tags:
  - workflow
  - review
```

## Templates

Use `templates` for reusable structures that readers can copy into their own work.

Field guidance:

- `difficulty`: how hard it is to adopt, not how smart the reader must be
- `time`: how long it takes to use or prepare
- `risk`: how costly the mistake is if the template is applied poorly
- `channels`: where this template is usually published or delivered
- `recommendedFor`: one sentence describing the best-fit team or situation

## Troubleshoot

Use `troubleshoot` for symptom-first recovery.

Recommended shape:

1. The title should match the symptom a reader would search
2. `checks` should be the first 2-3 things to verify
3. `commonCauses` should explain why the symptom happens
4. `ctaHref` should route back into a stable tutorial or Learn page

## Resources

Use the `/skills/` page as a reusable `resources` channel when the site needs a directory-like section.

Good fits:

- official documentation links
- recommended tools or starter stacks
- plugin directories
- curated services or integrations

If your site does not need this kind of channel, remove it from `src/config/site.ts` navigation instead of forcing content into it.

## Bilingual content

Keep English and Chinese file names aligned whenever possible.

Example:

- `src/content/learn/en/write-docs-next-to-the-repo.mdx`
- `src/content/learn/zh/write-docs-next-to-the-repo.mdx`

Rules:

1. Keep `publishedAt` aligned if they are versions of the same article
2. Update `updatedAt` whenever one language changes
3. If one language is missing, the detail page will show a translation status note
