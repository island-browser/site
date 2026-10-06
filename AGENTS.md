<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# island-browser/site

Product website for the Island browser: Next.js App Router, static export (`out/`), Tailwind v4.

- Repository coordinates and the default site URL live only in `site.config.ts`.
- `npm run build` runs `scripts/fetch-data.mjs` first (CHANGELOG.md, VERSION, releases from
  `island-browser/island`, falling back to `../island`, then to the committed `data/` snapshot).
- Graphite design tokens in `app/globals.css` must match Island's `DESIGN.md`; run
  `npm run check:tokens` after touching them.
- Design rules: no gradients of any kind, accent only for actions/active state/links, hairline
  borders, Geist + Geist Mono (self-hosted via the `geist` package), motion only fade/translate and
  always reduced-motion safe.
- Every internal link goes through `next/link` so `NEXT_PUBLIC_BASE_PATH` is respected.
