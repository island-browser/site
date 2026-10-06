# Deploying the Island site

The site is static and all page links are relative, so it runs unchanged on any static host. Build
it first: the version markers and the changelog come from the browser repository.

```bash
git clone --depth 1 https://github.com/island-browser/island ../island
python3 scripts/build.py --island ../island --out _site
```

## GitHub Pages (already wired)

`.github/workflows/pages.yml` builds `_site` and deploys it. Enable Pages once in the repository
settings (Source: GitHub Actions). The build fails instead of publishing when Island's `VERSION`
and `CHANGELOG.md` disagree or when `assets/css/site.css` drifts from the design tokens.

## Vercel

```bash
npm i -g vercel          # once
vercel --prod --cwd _site
```

The build copies `vercel.json` into `_site` with the pages; it adds cache and security headers.

## Pointing the SEO URLs at another domain

Canonical, `og:url`, JSON-LD, the sitemap and robots entries point at
`https://island-browser.github.io/site`. Rewrite them to another domain once, then commit:

```bash
python3 scripts/set_domain.py https://<your-domain>
git commit -am "Point the site SEO URLs at <your-domain>"
```

Only the exact current domain is replaced, so running it again is safe.
