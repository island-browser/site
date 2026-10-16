// Shared copy for the three style prototypes, so they differ only in style.

/** "Coming in 0.7" until data/VERSION reaches 0.7.0, "New in 0.7" after. */
export function sevenLabel(version: string) {
  const [major, minor] = version.split(".").map(Number);
  return major > 0 || minor >= 7 ? "New in 0.7" : "Coming in 0.7";
}

export const heroTitle = "A calm browser that plans before its agent acts.";
export const heroLede =
  "Island is a native desktop browser built directly on CEF. Tabs and spaces in a quiet sidebar, Reader, find and a built-in ad and tracker blocker, an agent one keystroke away, and research it plans with you before anything runs.";

export const pillars = [
  { id: "browse", branch: "A", title: "Browse", items: ["Spaces and pinned tabs", "Split view and All tabs", "Tab sleep and Peek", "History search in ⌘K"] },
  { id: "read", branch: "B", title: "Read", items: ["Reader view", "Find in page", "Ad and tracker blocking", "Start page with speed dial"] },
  { id: "agent", branch: "C", title: "Agent", items: ["ACP agent in the sidebar", "22 browser tools over MCP", "Research with a Plan tab", "Reports you can save"] },
  { id: "you", branch: "D", title: "Yours", items: ["Native, Arc and Graphite looks", "Every shortcut rebindable", "Import from five browsers", "Local history, local reports"] },
] as const;

export const research = {
  label: "Research",
  title: "Research is planned before it runs.",
  body: "Pick Research on the start page and ask a question. The agent proposes a plan: steps, branches, a join and a result. It opens as a Plan tab where you can skip or restore steps, write an instruction for one, branch from it, or ask the agent to expand it. Nothing runs until you choose Run plan, or Run one branch only.",
  points: [
    "Graph or List view, kept in sync",
    "At most three levels of branching before the agent must ask",
    "The result opens as a Report tab with Copy and Save as .md",
  ],
};
