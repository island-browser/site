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
export type Shortcut = { combos: Combo[]; action: string; note?: string; separator?: string };

export const shortcuts: Shortcut[] = [
  { combos: [["Cmd", "K"]], action: "Command palette" },
  { combos: [["Cmd", "Shift", "K"]], action: "Search palette" },
  { combos: [["Cmd", "J"]], action: "Show or hide the agent" },
  { combos: [["Cmd", "Shift", "A"]], action: "All tabs" },
  { combos: [["Cmd", ","]], action: "Settings" },
  { combos: [["Cmd", "B"]], action: "Show or hide the sidebar" },
  { combos: [["Cmd", "L"]], action: "Focus the address field" },
  { combos: [["Cmd", "T"], ["Cmd", "W"]], action: "New tab / close tab" },
  { combos: [["Cmd", "Shift", "["], ["Cmd", "Shift", "]"]], action: "Previous tab / next tab" },
  { combos: [["Cmd", "1"], ["9"]], action: "Select the numbered tab", separator: "…" },
  { combos: [["Cmd", "D"]], action: "Pin or unpin the tab" },
  { combos: [["Cmd", "Opt", "N"]], action: "New space" },
  { combos: [["F2"]], action: "Rename the space" },
  { combos: [["Cmd", "Shift", "S"]], action: "Split view with the next tab" },
  { combos: [["Cmd", "Opt", "["], ["Cmd", "Opt", "]"]], action: "Move the split divider" },
  {
    combos: [["Cmd", "["], ["Cmd", "]"]],
    action: "Back / forward",
    note: "macOS; Alt+← / → elsewhere",
  },
  { combos: [["Cmd", "R"]], action: "Reload" },
];

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
