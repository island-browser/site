# Island website (`island-browser/site`)

The product website for [Island](https://github.com/island-browser/island), a calm native desktop
browser built on CEF with a built-in AI agent. It is a static Next.js site (App Router,
`output: "export"`) styled with Tailwind CSS v4 and the Graphite design tokens from Island's
`DESIGN.md`, deployed to GitHub Pages at <https://island-browser.github.io/site>.

No analytics, no trackers, no remote fonts or images: Geist and Geist Mono are self-hosted from the
[`geist`](https://www.npmjs.com/package/geist) package.

## Pages

| Route         | Content                                                                     |
| ------------- | --------------------------------------------------------------------------- |
| `/`           | Landing page: product mockup, features, agents (MCP/ACP), keyboard, status  |
| `/docs/`      | Build, run, test, agents, shortcuts, import, updates, releases              |
| `/changelog/` | Rendered from the browser repo's `CHANGELOG.md` at build time               |
| `/download/`  | Per-platform archives from the latest GitHub release, with OS detection     |
| `/privacy/`   | Privacy notes for the site and the browser                                  |

## Develop

Requires Node 22.18 or newer (`.nvmrc`).

```bash
npm ci
npm run dev          # http://localhost:3000
npm run lint
npm run check:tokens # CSS tokens vs. Island's DESIGN.md
npm run build        # static export into out/
```

To check the export under the GitHub Pages base path, build with it and serve `out/` mounted at
`/site`:

```bash
NEXT_PUBLIC_BASE_PATH=/site npm run build
mkdir -p /tmp/pages && rm -rf /tmp/pages/site && cp -r out /tmp/pages/site
python3 -m http.server 4200 --directory /tmp/pages   # open http://localhost:4200/site/
```

### Configuration

| Variable                | Default                                 | Purpose                                   |
| ----------------------- | --------------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_BASE_PATH` | empty                                   | Path prefix; `/site` on Pages             |
| `NEXT_PUBLIC_SITE_URL`  | `https://island-browser.github.io/site` | Canonical URLs, sitemap, OpenGraph        |
| `ISLAND_READ_TOKEN`     | unset                                   | Read token for the browser repo           |
| `GITHUB_TOKEN`          | unset                                   | Fallback token for GitHub requests        |
| `ISLAND_DATA_OFFLINE`   | unset                                   | `1` skips the network in `fetch-data`     |
| `ISLAND_LOCAL_CHECKOUT` | `../island`                             | Sibling checkout used as a local fallback |

Repository coordinates (owner, repo names, branch, default site URL) live in one place:
`site.config.ts`.

## Build-time data

`npm run build` runs `scripts/fetch-data.mjs` first (`prebuild`). It refreshes three files under
`data/`, taking the first source that works:

1. GitHub: `CHANGELOG.md` and `VERSION` from `raw.githubusercontent.com`, and the release list from
   `api.github.com/repos/island-browser/island/releases`, sending `ISLAND_READ_TOKEN` (or
   `GITHUB_TOKEN`) when set.
2. A sibling checkout at `../island`, for local development.
3. The snapshot already committed in `data/`, so a blocked or failed network never breaks a build.

The changelog page, the version badge, the JSON-LD `softwareVersion`, and the download page all
read these files. An empty `data/releases.json` (`[]`) renders the download page's "no builds
published yet — build from source" state.

**The browser repository is private for now**, so unauthenticated fetches return 404 and the build
uses the committed snapshot. To build from live data in CI, add a fine-grained personal access
token with read-only *Contents* access to `island-browser/island` as the repository secret
`ISLAND_READ_TOKEN`. Refresh the snapshot locally with `npm run fetch-data` and commit `data/`.

## Design tokens

`app/globals.css` declares the Graphite tokens (light, dark, space markers, radii, spacing, motion)
as CSS variables. `npm run check:tokens` reads the fenced `design-tokens` block from Island's
`DESIGN.md` (from `../island/DESIGN.md` if present, otherwise from the browser repo on GitHub with
`ISLAND_READ_TOKEN`) and fails with a per-token diff if anything drifted.

## Deploy

`.github/workflows/deploy.yml` lints, checks the tokens, builds with
`NEXT_PUBLIC_BASE_PATH=/site`, and deploys `out/` with GitHub Pages. It runs on every push to
`main`, daily at 06:17 UTC (to pick up new releases), on `workflow_dispatch`, and on a
`repository_dispatch` event of type `island-release`, which the browser repo can send after
publishing a release:

```bash
gh api repos/island-browser/site/dispatches -f event_type=island-release
```

One-time setup: in the repository settings, set **Pages → Source** to **GitHub Actions**, and add
the `ISLAND_READ_TOKEN` secret while the browser repo is private.

## License

MIT — see [LICENSE](LICENSE).
