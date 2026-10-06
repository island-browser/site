# Island site

The product site for [Island](https://github.com/island-browser/island), served by GitHub Pages
at <https://island-browser.github.io/site/>. It moved here from the `site/` directory of the browser
repository; its history came along.

The pages are static and fully relative (no framework, no dependencies). Two things come from the
browser repository at build time: the current version (`VERSION`) and the release notes
(`CHANGELOG.md`, rendered by Island's own `scripts/version.py`). Do not edit the version markers
or the block between `<!-- changelog:start -->` and `<!-- changelog:end -->` by hand; the build
overwrites them.

## Build locally

```bash
git clone --depth 1 https://github.com/island-browser/island ../island
python3 scripts/build.py --island ../island --out _site
python3 -m http.server -d _site 8000
```

## Check

```bash
ISLAND_DIR=../island python3 -m pytest tests
```

`tests/test_token_parity.py` checks that `assets/css/site.css` matches the design-token contract
in Island's `DESIGN.md`. Changing a token means changing it there first, then here.

## Deploy

`.github/workflows/pages.yml` builds and deploys on every push to `main`, once a day (to pick up
new versions and changelog entries), on demand, and on an `island-updated` repository_dispatch.
Pull requests run the checks and the build without deploying.

`island-browser/island` is private, so the workflow reads it with the `ISLAND_READ_TOKEN`
repository secret: a fine-grained personal access token limited to that repository with read-only
**Contents** permission. Without the secret it publishes the pages as committed (with the version
and changelog they were last rendered with) and leaves a warning on the run. To refresh the
committed pages by hand, build with `--island` and copy `_site/*.html` back over the pages. See [DEPLOY.md](DEPLOY.md) for
other hosts and for changing the domain.
