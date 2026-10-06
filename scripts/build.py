#!/usr/bin/env python3
"""Build the Island site into a deployable directory. Stdlib only.

The pages in this repository are static and fully relative. The only parts
that come from the browser repository are the current version and the
release notes, so they are filled in at build time from a checkout of
island-browser/island (its `VERSION`, `CHANGELOG.md` and `scripts/version.py`):

    python3 scripts/build.py --island ../island --out _site
    python3 scripts/build.py --out _site      # no checkout: publish the pages as committed

Every `data-island-version` element and the JSON-LD `softwareVersion` get the
version, and changelog.html gets the rendered CHANGELOG between the
`<!-- changelog:start -->` and `<!-- changelog:end -->` markers. The Markdown
rendering is island's own `render_changelog_html`, so there is one renderer.
"""

from __future__ import annotations

import argparse
import importlib.util
import re
import shutil
import sys
from pathlib import Path
from types import ModuleType

SITE = Path(__file__).resolve().parents[1]
# Repository files that are not part of the published site.
EXCLUDED = {".git", ".github", "scripts", "tests", "README.md", "DEPLOY.md", "_site",
            "__pycache__", ".pytest_cache"}

MARKER = re.compile(r"(<[^>]*\bdata-island-version\b[^>]*>)[^<]*(<)")
JSON_LD = re.compile(r'("softwareVersion":\s*")[^"]*(")')


class BuildError(Exception):
    pass


def load_version_tool(island: Path) -> ModuleType:
    path = island / "scripts" / "version.py"
    if not path.is_file():
        raise BuildError(f"{path} is missing; is --island a checkout of island-browser/island?")
    spec = importlib.util.spec_from_file_location("island_version_tool", path)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module  # dataclasses resolve their module by name
    spec.loader.exec_module(module)
    return module


def render_page(text: str, name: str, version: str, changelog_html: str, tool: ModuleType) -> str:
    text = MARKER.sub(lambda m: f"{m[1]}{version}{m[2]}", text)
    text = JSON_LD.sub(lambda m: f"{m[1]}{version}{m[2]}", text)
    if name == "changelog.html":
        start, end = tool.CHANGELOG_START, tool.CHANGELOG_END
        a, b = text.find(start), text.find(end)
        if a < 0 or b < a:
            raise BuildError(f"{name} lacks the {start} ... {end} markers")
        text = text[:a + len(start)] + "\n" + changelog_html + "\n" + text[b:]
    return text


def build(island: Path | None, out: Path) -> str | None:
    if island is not None:
        tool = load_version_tool(island)
        version = str(tool.read_version(island))
        problems = [p for p in tool.check(island, None) if "is out of date" not in p]
        if problems:
            raise BuildError("; ".join(problems))
        changelog_html = tool.render_changelog_html(
            (island / "CHANGELOG.md").read_text(encoding="utf-8"))
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    for source in sorted(SITE.iterdir()):
        if source.name in EXCLUDED or source.resolve() == out.resolve():
            continue
        target = out / source.name
        if source.is_dir():
            shutil.copytree(source, target)
        else:
            shutil.copy2(source, target)
    if island is None:
        return None
    for page in sorted(out.glob("*.html")):
        text = page.read_text(encoding="utf-8")
        page.write_text(render_page(text, page.name, version, changelog_html, tool),
                        encoding="utf-8")
    return version


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--island", type=Path,
                        help="a checkout of island-browser/island (omit to publish the pages "
                             "with the version and changelog they were committed with)")
    parser.add_argument("--out", type=Path, default=SITE / "_site", help="output directory")
    args = parser.parse_args(argv)
    try:
        version = build(args.island, args.out)
    except BuildError as error:
        print(f"error: {error}", file=sys.stderr)
        return 1
    if version is None:
        print(f"copied the committed pages into {args.out} (no Island checkout given)")
    else:
        print(f"built Island {version} site into {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
