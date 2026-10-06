"""Drift guard: the site's CSS custom properties match Island's design tokens.

`DESIGN.md` in island-browser/island holds the single machine-readable token
contract (a fenced ``design-tokens`` JSON block). This suite proves that
`assets/css/site.css` resolves to exactly those values. Point it at a checkout
of the browser repository with ISLAND_DIR (default: ../island):

    ISLAND_DIR=../island python3 -m pytest tests
"""

from __future__ import annotations

import json
import os
import re
import unittest
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
ISLAND = Path(os.environ.get("ISLAND_DIR", SITE.parent / "island")).resolve()
DESIGN_MD = ISLAND / "DESIGN.md"
SITE_CSS = SITE / "assets/css/site.css"

CONTRACT_FENCE = re.compile(r"```design-tokens[ \t]*\n(?P<json>.*?)\n```", re.DOTALL)
HEX_COLOR = re.compile(r"^#[0-9A-F]{6}$")
CSS_DECLARATION = re.compile(r"(--[A-Za-z0-9-]+)\s*:\s*([^;{}]+);")

SEMANTIC_TO_CSS = {
    "background": "--bg",
    "surface": "--surface",
    "surface_secondary": "--surface-2",
    "text": "--text",
    "text_secondary": "--text-2",
    "border": "--border",
    "accent": "--accent",
}
SITE_ONLY_TO_CSS = {
    "space_blue": "--space-blue",
    "space_coral": "--space-coral",
    "space_green": "--space-green",
}
SPACING_TO_CSS = {
    "space_1": "--space-1",
    "space_2": "--space-2",
    "space_3": "--space-3",
    "space_4": "--space-4",
    "space_6": "--space-6",
}
RADII_TO_CSS = {
    "radius_small": "--radius-sm",
    "radius_medium": "--radius-md",
}
MOTION_TO_CSS = {
    "fast_ms": "--motion-fast",
    "enter_ms": "--motion-enter",
    "reveal_ms": "--motion-reveal",
}


def load_contract() -> dict:
    text = DESIGN_MD.read_text(encoding="utf-8")
    blocks = CONTRACT_FENCE.findall(text)
    if len(blocks) != 1:
        raise ValueError(f"DESIGN.md must contain exactly one `design-tokens` block, found {len(blocks)}")
    return json.loads(blocks[0])


def parse_declarations(css_text: str, start: int) -> dict[str, str]:
    root = css_text.find(":root", start)
    if root == -1:
        raise ValueError("no :root block found in site CSS")
    body = css_text[root : css_text.index("}", root)]
    return {name: value.strip() for name, value in CSS_DECLARATION.findall(body)}


def load_site_tokens() -> tuple[dict[str, str], dict[str, str]]:
    """Return (light custom properties, effective dark custom properties)."""
    css_text = SITE_CSS.read_text(encoding="utf-8")
    light = parse_declarations(css_text, 0)
    dark_media = css_text.find("@media (prefers-color-scheme: dark)")
    if dark_media == -1:
        raise ValueError("no dark scheme media block found in site CSS")
    overrides = parse_declarations(css_text, dark_media)
    dark = {**light, **overrides}
    return light, dark


class SiteConsumerParity(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.contract = load_contract()
        cls.light, cls.dark = load_site_tokens()

    def assert_color(self, css_property: str, expected: str, theme: str) -> None:
        value = (self.light if theme == "light" else self.dark).get(css_property)
        self.assertIsNotNone(value, f"{css_property} is not declared for the {theme} site theme")
        self.assertEqual(value.upper(), expected.upper(), f"{css_property} drifted in {theme}")

    def test_light_semantic_colors_match_the_contract(self) -> None:
        for role, css_property in SEMANTIC_TO_CSS.items():
            with self.subTest(role=role):
                self.assert_color(css_property, self.contract["colors"]["light"][role], "light")

    def test_dark_semantic_colors_match_the_contract(self) -> None:
        # Values not re-declared inside the dark media block inherit from :root,
        # mirroring how the browser resolves them.
        for role, css_property in SEMANTIC_TO_CSS.items():
            with self.subTest(role=role):
                self.assert_color(css_property, self.contract["colors"]["dark"][role], "dark")

    def test_site_only_marker_colors_match_the_contract(self) -> None:
        for role, css_property in SITE_ONLY_TO_CSS.items():
            for theme in ("light", "dark"):
                with self.subTest(role=role, theme=theme):
                    self.assert_color(css_property, self.contract["colors"]["site_only"][role], theme)

    def test_spacing_tokens_match_the_contract_in_px(self) -> None:
        for token, css_property in SPACING_TO_CSS.items():
            with self.subTest(token=token):
                value = self.light[css_property]
                match = re.fullmatch(r"(\d+)px", value)
                self.assertIsNotNone(match, f"{css_property} is not a px token: {value}")
                self.assertEqual(int(match.group(1)), self.contract["spacing"][token])

    def test_radius_tokens_match_the_contract_in_px(self) -> None:
        for token, css_property in RADII_TO_CSS.items():
            with self.subTest(token=token):
                value = self.light[css_property]
                match = re.fullmatch(r"(\d+)px", value)
                self.assertIsNotNone(match, f"{css_property} is not a px token: {value}")
                self.assertEqual(int(match.group(1)), self.contract["radii"][token])

    def test_motion_durations_match_the_contract_in_ms(self) -> None:
        for token, css_property in MOTION_TO_CSS.items():
            with self.subTest(token=token):
                value = self.light[css_property]
                match = re.fullmatch(r"(\d+)ms", value)
                self.assertIsNotNone(match, f"{css_property} is not an ms token: {value}")
                self.assertEqual(int(match.group(1)), self.contract["motion"][token])

    def test_easing_matches_the_contract(self) -> None:
        value = re.sub(r"\s+", "", self.light["--ease-out"])
        expected = re.sub(r"\s+", "", self.contract["motion"]["ease_out"])
        self.assertEqual(value, expected)

    def test_font_stacks_match_the_contract(self) -> None:
        typography = self.contract["typography"]
        self.assertEqual(self.light["--sans"], typography["ui_stack"])
        self.assertEqual(self.light["--mono"], typography["mono_stack"])


if __name__ == "__main__":
    unittest.main()
