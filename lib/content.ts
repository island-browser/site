// Shared product copy: the MCP tool list, keyboard shortcuts, and agent configuration snippets.
// Ported from the original static site (site/index.html and site/docs.html in the browser repo).

import { repoUrl } from "@/site.config";

/** `description` is the docs table wording; `summary` is the shorter landing-page line. */
export type ToolGroup = { label: string; tools: string[]; description: string; summary: string };

export const toolGroups: ToolGroup[] = [
  {
    label: "Tabs",
    tools: ["browser_list_tabs", "browser_list_spaces"],
    description: "Every tab and space, with ids, titles, and URLs",
    summary: "Everything that is open, with ids, titles, and URLs",
  },
  {
    label: "Navigate",
    tools: ["browser_open_tab", "browser_navigate"],
    description: "Open or load an http(s) URL",
    summary: "Go somewhere: open or load an http(s) URL",
  },
  {
    label: "Manage",
    tools: ["browser_activate_tab", "browser_close_tab", "browser_pin_tab"],
    description: "Manage tabs",
    summary: "Focus, close, or pin a tab",
  },
  {
    label: "History",
    tools: ["browser_back", "browser_forward", "browser_reload"],
    description: "History",
    summary: "Back, forward, and reload",
  },
  {
    label: "Spaces",
    tools: ["browser_new_space", "browser_switch_space"],
    description: "Organize spaces",
    summary: "Create a space or switch to one",
  },
  {
    label: "Layout",
    tools: ["browser_toggle_sidebar", "browser_toggle_split"],
    description: "Layout",
    summary: "Show the sidebar or pair tabs in a split",
  },
  {
    label: "Read",
    tools: ["page_read", "page_snapshot"],
    description: "The page as text, or as numbered interactive elements",
    summary: "The page as text, or as clickable elements",
  },
  {
    label: "Act",
    tools: ["page_click", "page_type", "page_press_key", "page_scroll"],
    description: "Act on the page",
    summary: "Click, type, press keys, and scroll",
  },
  {
    label: "Inspect",
    tools: ["page_screenshot", "page_evaluate"],
    description: "See the page, or run JavaScript in it",
    summary: "What the page looks like, or JavaScript run in it",
  },
];

export const toolCount = toolGroups.reduce((n, g) => n + g.tools.length, 0);

/** A key combination: each entry is one key cap. "Cmd", "Shift", "Opt" render as symbols. */
export type Combo = string[];

export type ShortcutGroup =
  | "Navigate"
  | "Tabs"
  | "Spaces and layout"
  | "Page"
  | "Palettes, agent and app";

/**
 * One default binding, in keymap.cc's notation ("Mod" is Cmd on macOS and Ctrl elsewhere,
 * "Control" is the Control key everywhere). `other` is set where Windows and Linux differ beyond
 * Mod; `since` marks a binding that is not in the current release yet.
 */
export type Shortcut = {
  id: string;
  group: ShortcutGroup;
  action: string;
  mac: string;
  other?: string;
  note?: string;
  since?: string;
};

// Generated from the kActions table in the browser's src/main/keymap.cc (macOS defaults), in
// keymap order within each group. Every one is rebindable in Settings > Shortcuts.
export const shortcuts: Shortcut[] = [
  { id: "back", group: "Navigate", action: "Back", mac: "Mod+[", other: "Alt+Left" },
  { id: "forward", group: "Navigate", action: "Forward", mac: "Mod+]", other: "Alt+Right" },
  { id: "reload", group: "Navigate", action: "Reload", mac: "Mod+R" },
  { id: "reload_ignore_cache", group: "Navigate", action: "Reload ignoring cache", mac: "Mod+Shift+R" },
  { id: "stop_loading", group: "Navigate", action: "Stop loading", mac: "Mod+." },
  { id: "focus_address", group: "Navigate", action: "Focus address", mac: "Mod+L" },
  { id: "copy_url", group: "Navigate", action: "Copy tab URL", mac: "Mod+Shift+C", note: "macOS only for now" },
  { id: "new_tab", group: "Tabs", action: "New tab", mac: "Mod+T" },
  { id: "close_tab", group: "Tabs", action: "Close tab", mac: "Mod+W" },
  { id: "reopen_tab", group: "Tabs", action: "Reopen closed tab", mac: "Mod+Shift+T" },
  { id: "next_tab", group: "Tabs", action: "Next tab", mac: "Mod+Shift+]" },
  { id: "previous_tab", group: "Tabs", action: "Previous tab", mac: "Mod+Shift+[" },
  { id: "next_tab_alt", group: "Tabs", action: "Next tab (alternate)", mac: "Control+Tab" },
  { id: "previous_tab_alt", group: "Tabs", action: "Previous tab (alternate)", mac: "Control+Shift+Tab" },
  { id: "toggle_pin", group: "Tabs", action: "Pin or unpin tab", mac: "Mod+D" },
  { id: "tab_overview", group: "Tabs", action: "All tabs", mac: "Mod+Shift+A" },
  { id: "new_space", group: "Spaces and layout", action: "New space", mac: "Mod+Alt+N" },
  { id: "rename_space", group: "Spaces and layout", action: "Rename space", mac: "F2" },
  { id: "next_space", group: "Spaces and layout", action: "Next space", mac: "Mod+Alt+Down" },
  { id: "previous_space", group: "Spaces and layout", action: "Previous space", mac: "Mod+Alt+Up" },
  { id: "toggle_sidebar", group: "Spaces and layout", action: "Toggle sidebar", mac: "Mod+B" },
  { id: "toggle_split", group: "Spaces and layout", action: "Split view with the next tab", mac: "Mod+Shift+S" },
  { id: "divider_left", group: "Spaces and layout", action: "Move split divider left", mac: "Mod+Alt+[" },
  { id: "divider_right", group: "Spaces and layout", action: "Move split divider right", mac: "Mod+Alt+]" },
  { id: "zoom_in", group: "Page", action: "Zoom in", mac: "Mod+=" },
  { id: "zoom_in_alt", group: "Page", action: "Zoom in (alternate)", mac: "Mod+Shift+=" },
  { id: "zoom_out", group: "Page", action: "Zoom out", mac: "Mod+-" },
  { id: "zoom_reset", group: "Page", action: "Reset zoom", mac: "Mod+0" },
  { id: "find_in_page", group: "Page", action: "Find in page", mac: "Mod+F" },
  { id: "find_next", group: "Page", action: "Find next match", mac: "Mod+G" },
  { id: "find_previous", group: "Page", action: "Find previous match", mac: "Mod+Shift+G" },
  { id: "reader_mode", group: "Page", action: "Reader mode", mac: "Mod+Alt+R" },
  { id: "command_palette", group: "Palettes, agent and app", action: "Command palette", mac: "Mod+K" },
  { id: "search_palette", group: "Palettes, agent and app", action: "Search palette", mac: "Mod+Shift+K" },
  { id: "toggle_agent", group: "Palettes, agent and app", action: "Show or hide the agent", mac: "Mod+J" },
  { id: "settings", group: "Palettes, agent and app", action: "Settings", mac: "Mod+," },
  { id: "cheatsheet", group: "Palettes, agent and app", action: "Show shortcut cheatsheet", mac: "Mod+/", since: "0.7" },
];

export const shortcutGroups: ShortcutGroup[] = [
  "Navigate",
  "Tabs",
  "Spaces and layout",
  "Page",
  "Palettes, agent and app",
];

const MAC_KEYS: Record<string, string> = { Mod: "Cmd", Alt: "Opt" };

/** Key caps for a keymap chord as macOS shows it ("Mod+Shift+K" → ⌘ ⇧ K). */
export const macCombo = (chord: string): Combo =>
  chord.split(/\+(?!$)/).map((k) => MAC_KEYS[k] ?? k);

/** The default binding for an action id, as macOS key caps. */
export const comboFor = (id: string): Combo => {
  const s = shortcuts.find((x) => x.id === id);
  if (!s) throw new Error(`no shortcut ${id}`);
  return macCombo(s.mac);
};

/** "Coming in 0.7" until data/VERSION reaches 0.7.0, "New in 0.7" after. */
export function sevenLabel(version: string) {
  const [major, minor] = version.split(".").map(Number);
  return major > 0 || minor >= 7 ? "New in 0.7" : "Coming in 0.7";
}

/** Whether 0.7 (the Native look, the Plan tab, the cheatsheet) is in the current release. */
export const hasSeven = (version: string) => sevenLabel(version) === "New in 0.7";

/** How many default bindings the given release has (0.7 adds the cheatsheet). */
export const shortcutCount = (version: string) =>
  shortcuts.filter((s) => !s.since || hasSeven(version)).length;

export const mcpHttpConfig = `{
  "mcpServers": {
    "island": {
      "type": "http",
      "url": "http://127.0.0.1:9223/mcp",
      "headers": {
        "Authorization": "Bearer <token from Settings>"
      }
    }
  }
}`;

export const mcpBridgeConfig = `{
  "mcpServers": {
    "island": { "command": "/path/to/island_mcp_bridge" }
  }
}`;

/** ACP agents the sidebar can run, as Island's provider presets launch them. */
export const acpProviders = [
  { id: "claude", name: "Claude Code", command: "npx -y @agentclientprotocol/claude-agent-acp", needs: "npx · Claude login" },
  { id: "codex", name: "Codex", command: "npx -y @agentclientprotocol/codex-acp", needs: "npx · ChatGPT or API key" },
  { id: "opencode", name: "OpenCode", command: "opencode acp", needs: "npm i -g opencode-ai" },
  { id: "gemini", name: "Gemini CLI", command: "gemini --acp", needs: "npm i -g @google/gemini-cli" },
  { id: "qwen", name: "Qwen Code", command: "qwen --acp", needs: "npm i -g @qwen-code/qwen-code" },
  { id: "goose", name: "Goose", command: "goose acp", needs: "goose CLI" },
] as const;

export const acpCommand = `# Pick a provider in the agent panel or Settings → Agent & tools.
# Each one is an ACP agent Island starts as a local program:
${acpProviders.map((p) => `#   ${p.name.padEnd(12)} ${p.command}`).join("\n")}

# Or run any other ACP agent:
$ export ISLAND_AGENT_COMMAND="my-agent --acp"
$ open build/src/main/island_browser.app`;

export const buildSnippet = `$ git clone ${repoUrl} && cd island
$ ./scripts/setup_deps.sh && cmake -B build -S . && cmake --build build`;
