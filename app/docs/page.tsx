import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { DocSection } from "@/components/docs/doc-section";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";
import { Keys } from "@/components/keys";
import {
  acpProviders,
  comboFor,
  type Combo,
  hasSeven,
  macCombo,
  mcpBridgeConfig,
  sevenLabel,
  shortcutCount,
  shortcutGroups,
  shortcuts,
  toolGroups,
} from "@/lib/content";
import { getVersion } from "@/lib/data";
import { links } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Docs",
  path: "/docs/",
  socialTitle: "Island Docs",
  description:
    "Install or build Island; tabs, spaces, tab sleep and Peek; Reader, find and ad and tracker blocking; history search; Research and the Plan tab; agents over ACP and MCP; every keyboard shortcut; looks; and updates.",
});

const TOC: TocItem[] = [
  { id: "quick-start", label: "Quick start" },
  { id: "first-run", label: "First run" },
  { id: "looks", label: "Looks" },
  { id: "tabs", label: "Tabs and spaces" },
  { id: "start-page", label: "Start page and search" },
  { id: "reader", label: "Reader and find" },
  { id: "privacy", label: "Privacy and blocking" },
  { id: "history", label: "History search" },
  { id: "research", label: "Research and the Plan tab" },
  { id: "agents", label: "AI agents" },
  { id: "shortcuts", label: "Keyboard shortcuts" },
  { id: "import", label: "Import" },
  { id: "updates", label: "Updates" },
  { id: "testing", label: "Smoke test and test suites" },
  { id: "versions", label: "Versions and releases" },
  { id: "project-layout", label: "How the code is organized" },
  { id: "status", label: "Honest status" },
];

const MCP_DOCS_CONFIG = `{
  "mcpServers": {
    "island": {
      "type": "http",
      "url": "http://127.0.0.1:9223/mcp",
      "headers": { "Authorization": "Bearer <token>" }
    }
  }
}`;

const ENV_VARS = [
  {
    name: "ISLAND_AGENT_COMMAND",
    value: "command line",
    effect: (
      <>
        Overrides the ACP agent the sidebar runs, whatever provider is selected in Settings → Agent
        &amp; tools.
      </>
    ),
  },
  {
    name: "ISLAND_AGENT_PORT",
    value: "port",
    effect: (
      <>
        Port for the MCP endpoint. Defaults to <code>9223</code>, or a random free port if 9223 is
        taken.
      </>
    ),
  },
  {
    name: "ISLAND_AGENT_ENDPOINT",
    value: "off",
    effect: <>Turns the MCP tools endpoint off.</>,
  },
  {
    name: "ISLAND_DISABLE_UPDATES",
    value: "1",
    effect: <>Turns the update checks off.</>,
  },
  {
    name: "ISLAND_MCP_URL",
    value: "URL",
    effect: (
      <>
        For <code>island_mcp_bridge</code> only: the endpoint to forward to, instead of the one in{" "}
        <code>agent-endpoint.json</code>.
      </>
    ),
  },
  {
    name: "ISLAND_MCP_TOKEN",
    value: "token",
    effect: (
      <>
        For <code>island_mcp_bridge</code> only: the bearer token to send, instead of the one in{" "}
        <code>agent-endpoint.json</code>.
      </>
    ),
  },
];

const OTHER_KEYS: Record<string, string> = { Mod: "Ctrl" };
/** Key caps for a keymap chord on Windows and Linux. */
const otherCombo = (chord: string): Combo => chord.split(/\+(?!$)/).map((k) => OTHER_KEYS[k] ?? k);

export default function DocsPage() {
  const version = getVersion();
  const seven = sevenLabel(version);
  const sevenTag = <span className="tag tag-new align-[1px]">{seven}</span>;
  return (
    <div className="frame">
      <div className="gutter border-b border-line py-16 sm:py-20">
        <p className="label mb-3">Island Docs</p>
        <h1 className="h1">How Island works.</h1>
        <p className="lede mt-5 max-w-[64ch]">
          Version <span className="font-mono text-[0.9em] text-fg">{version}</span>. Everything below
          is in this release unless it carries the {sevenTag} pill. Those parts are merged and ship
          with the next version. If a claim here and the repository disagree, the repository wins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="gutter border-b border-line py-6 lg:border-r lg:border-b-0 lg:!pr-6 lg:py-14">
          <div className="lg:sticky lg:top-20">
            <DocsToc items={TOC} />
          </div>
        </aside>

        <div className="gutter min-w-0 py-14">
          <div className="max-w-[760px]">
            <DocSection id="quick-start" title="Quick start">
              <p>
                The quickest way in is a prerelease from the <Link href="/download/">download
                page</Link>: a disk image for macOS, an installer for Windows, a Debian package for
                Linux, and portable archives for all six targets. They are unsigned, so the page also
                explains how to get past Gatekeeper or SmartScreen and how to check the checksum.
              </p>
              <h3 id="build">Build from source</h3>
              <p>
                From a clean checkout, vendor the pinned dependencies first. The CEF binary
                distribution and the Geist fonts are fetched by <code>scripts/setup_deps.sh</code>{" "}
                from the versions locked in <code>deps/dependencies.lock.json</code>; both land in
                gitignored directories and are never committed.
              </p>
              <CodeBlock
                code={`$ ./scripts/setup_deps.sh
$ python3 scripts/deps.py verify`}
              />
              <p>
                The first configure needs network access: GoogleTest is fetched through CMake{" "}
                <code>FetchContent</code>. Then build, run the default test suite and open the app.
              </p>
              <CodeBlock
                code={`$ cmake -B build -S .
$ cmake --build build
$ ctest --test-dir build --output-on-failure
$ open build/src/main/island_browser.app`}
              />
              <p>
                The ad and tracker blocker needs a stable Rust toolchain (<code>cargo</code> and{" "}
                <code>rustc</code>). CMake turns <code>ISLAND_ENABLE_CONTENT_BLOCKER</code> on when it
                finds <code>cargo</code>; without it you get a build whose blocker does nothing.
              </p>
            </DocSection>

            <DocSection id="first-run" title="First run">
              <p>
                The first launch shows one welcome card that offers, never blocks. It asks for a
                theme (<code>System</code>, <code>Light</code> or <code>Dark</code>) and lists the
                browsers found on your machine to import from (see <a href="#import">Import</a>).
              </p>
              <p>
                Press <Keys combo={["Esc"]} /> or choose &ldquo;Just start browsing&rdquo; to skip it.
                &ldquo;Show Welcome…&rdquo; in the browser menu reopens it, and Settings can import
                again at any time.
              </p>
            </DocSection>

            <DocSection id="looks" title="Looks">
              <p>
                {sevenTag} Settings → Appearance starts with a <strong>Look</strong> preset:
              </p>
              <ul>
                <li>
                  <strong>Native</strong>, the default for new profiles: a grey source-list sidebar,
                  a segmented space switcher (initials only beyond four spaces), the New Tab row
                  under the tabs, one full-width Agent button at the bottom, system-blue selected
                  rows, and an address field that shows page state as indicators: a shield with the
                  blocked-request count, Reader on pages that have a reader view, and an agent dot
                  (blue while the agent works, orange while it waits for you). Native has no space
                  colors.
                </li>
                <li>
                  <strong>Arc</strong>, which existing profiles keep: the sidebar and window margin
                  tinted in the space&rsquo;s color, the page on an inset card with rounded corners
                  and a soft shadow, and a frameless window on macOS.
                </li>
                <li>
                  <strong>Graphite</strong>: neutral greys and hairlines, the sidebar Island 0.6
                  ships with.
                </li>
              </ul>
              <p>
                Below the preset, Appearance groups the controls into Theme, Color, Layout and Text:
                per-space color (ten presets or a hex value), sidebar tint, sidebar on the left or
                right, page corner radius (0, 6, 10 or 14), density, interface font, the page
                card&rsquo;s shadow and full bleed. Changing any of them labels the look{" "}
                <strong>Custom</strong>. Native hides the space color and tint controls.
              </p>
              {!hasSeven(version) && (
                <p>
                  Until 0.7, Island {version} has one look: the Graphite sidebar tinted by the
                  space, with the theme set to System, Light or Dark.
                </p>
              )}
            </DocSection>

            <DocSection id="tabs" title="Tabs and spaces">
              <ul>
                <li>
                  <strong>Spaces</strong> are named groups of tabs. <Keys combo={comboFor("new_space")} />{" "}
                  makes one, <Keys combo={comboFor("rename_space")} /> renames it, and{" "}
                  <Keys combo={comboFor("next_space")} /> / <Keys combo={comboFor("previous_space")} />{" "}
                  move between them.
                </li>
                <li>
                  <strong>Pinned tabs</strong> (<Keys combo={comboFor("toggle_pin")} />) stay first
                  in their space and never sleep.
                </li>
                <li>
                  <strong>The icon rail</strong>: <Keys combo={comboFor("toggle_sidebar")} />{" "}
                  collapses the sidebar to a 52-point rail with one button per tab, a new-tab button
                  and the spaces. The choice is kept across launches, and{" "}
                  <Keys combo={comboFor("focus_address")} /> from the rail opens the sidebar while
                  you type.
                </li>
                <li>
                  <strong>Split view</strong> (<Keys combo={comboFor("toggle_split")} />) pairs the
                  tab with the next one; <Keys combo={comboFor("divider_left")} /> and{" "}
                  <Keys combo={comboFor("divider_right")} /> move the divider. Closing either half
                  returns the other to full width.
                </li>
                <li>
                  <strong>All tabs</strong> (<Keys combo={comboFor("tab_overview")} />) shows every
                  space&rsquo;s tabs as searchable cards with their blocked-request counts. Arrows
                  and Enter jump, Delete closes, <Keys combo={["P"]} /> pins, and dragging a card
                  onto another space moves it.
                </li>
                <li>
                  <strong>Tab sleep</strong>: a tab you have not used for 15, 30 (the default) or 60
                  minutes releases its page to free memory (Settings → Tabs, or Never). It keeps its
                  address, title, favicon and scroll position, shows dimmed, and reloads where you
                  left off. Pinned tabs, the tab on screen, split-view partners, tabs playing audio
                  and tabs with unsaved form input never sleep. The command palette has &ldquo;Sleep
                  inactive tabs now&rdquo;.
                </li>
                <li>
                  <strong>Peek</strong>: <Keys combo={["Cmd"]} />-click or middle-click a link, or
                  choose &ldquo;Open in peek&rdquo;, and the page opens in a floating card over the
                  current one, with &ldquo;Open as tab&rdquo; and &ldquo;Close&rdquo;. Links a page
                  opens in a new tab peek too. <Keys combo={["Esc"]} /> closes it.
                </li>
                <li>
                  <strong>Session restore</strong>: after a clean quit Island rebuilds your spaces,
                  tabs, pins, selections and split pairs. Restored addresses are checked like
                  anything you type. <Keys combo={comboFor("reopen_tab")} /> reopens the last closed
                  tab.
                </li>
              </ul>
            </DocSection>

            <DocSection id="start-page" title="Start page and search">
              <p>
                New tabs open on Island&rsquo;s own start page, a local document that requests
                nothing until you submit. One field has three modes: <strong>Search</strong> opens
                the results in that tab, <strong>Ask agent</strong> sends the text to the agent
                panel, and <strong>Research</strong> starts a <a href="#research">research</a> turn.
                The last mode is remembered.
              </p>
              <p>
                {sevenTag} The modes become a segmented control (Tab and Shift+Tab step through them
                while the field has focus), and six speed-dial tiles show your most visited sites,
                one per host, taken from history. Clearing history clears the tiles.
              </p>
              <p>
                The address bar searches when the text is not an address: <code>weather in
                oslo</code> opens a results page. Bare hosts such as <code>example.com</code> open
                over https, localhost and IP addresses over http. Choose Google (the default),
                DuckDuckGo or Yandex in the Search section of Settings.{" "}
                <Keys combo={comboFor("search_palette")} /> opens the search palette.
              </p>
            </DocSection>

            <DocSection id="reader" title="Reader and find">
              <h3 id="reader-view">Reader view</h3>
              <p>
                <Keys combo={comboFor("reader_mode")} /> (or the Reader button in the address field)
                pulls the article out of the page and shows it in Island&rsquo;s own reader document,
                with controls for text size, page width and Auto, Light, Sepia or Dark. Your choices
                are remembered, and Settings → Reader sets the defaults. Toggling again returns to
                the page. Reader fetches nothing extra.
              </p>
              <h3 id="find">Find in page</h3>
              <p>
                <Keys combo={comboFor("find_in_page")} /> opens a small bar at the top right of the
                page with an &ldquo;n of m&rdquo; count and a match-case toggle. Enter and
                Shift+Enter, or <Keys combo={comboFor("find_next")} /> and{" "}
                <Keys combo={comboFor("find_previous")} />, step through the matches;{" "}
                <Keys combo={["Esc"]} /> closes the bar, and so does switching tabs.
              </p>
            </DocSection>

            <DocSection id="privacy" title="Privacy and blocking">
              <p>
                Island blocks ads and trackers natively: Brave&rsquo;s <code>adblock</code> engine
                checks EasyList and EasyPrivacy before a page&rsquo;s subresources load. Settings →
                Privacy turns ads and trackers on or off separately and keeps a per-site allowlist,
                and All tabs shows each tab&rsquo;s blocked count. {sevenTag} In the Native look the
                count also sits in a shield at the left of the address field; clicking it opens
                Settings → Privacy.
              </p>
              <p>
                The lists are downloaded at runtime, refreshed in the background at most every four
                days, and Island keeps working from its cached copy when an update fails. Site
                permission requests (camera, microphone, location, notifications) are declined,
                because Island does not show a permission prompt yet. The{" "}
                <Link href="/privacy/#browser">privacy page</Link> lists everything the browser
                sends and keeps.
              </p>
            </DocSection>

            <DocSection id="history" title="History search">
              <p>
                Island keeps your browsing history on this device: the address and title of http and
                https pages (never local, data or credentialed addresses), up to the newest 50,000
                visits. <Keys combo={comboFor("command_palette")} /> searches it alongside open tabs,
                bookmarks and reports; the last word you type matches as a prefix, and results rank
                by text match, recency and how often you visit. Settings can stop recording new
                visits or clear the history.
              </p>
            </DocSection>

            <DocSection id="research" title="Research and the Plan tab">
              <p>
                Pick <strong>Research</strong> on the start page and press Enter. The question goes
                to your agent with a prompt to research it with Island&rsquo;s browser tools: a new
                space named after the question, several sources in tabs, compared. The agent
                finishes with a Markdown report that cites every claim, and the report opens in a{" "}
                <strong>Report</strong> tab with Copy Markdown, Save as .md… and Continue in agent
                panel. Reports are kept in <code>reports.json</code> and listed in Settings → Reports
                and in <Keys combo={comboFor("command_palette")} />.
              </p>
              <h3 id="plan-tab">
                The Plan tab {sevenTag}
              </h3>
              <p>
                In 0.7 the agent first proposes a plan, and nothing runs until you approve it. The
                plan opens in a <strong>Plan</strong> tab, pinned first in the space, as a graph or a
                list of steps, branches, a join and a result, with at most three levels of branching.
                While it waits, the agent panel says &ldquo;Waiting for approval&rdquo;.
              </p>
              <ul>
                <li>Skip a step or restore it, and write an instruction for one step.</li>
                <li>Branch from a step, or ask the agent to expand it.</li>
                <li>
                  Choose <strong>Run plan</strong>, <strong>Run one branch only</strong>, or{" "}
                  <strong>Cancel</strong>.
                </li>
              </ul>
              <p>
                Each research reuses its one Plan tab. Plans from other ACP agents open in List view.
              </p>
            </DocSection>

            <DocSection id="agents" title="AI agents">
              <p>
                Island works with agents in two directions: an agent can run <em>inside</em> the
                browser, in the sidebar, and any agent you already use can drive the browser from
                outside through its tools.
              </p>

              <h3 id="acp">The agent in the sidebar (ACP)</h3>
              <p>
                <Keys combo={comboFor("toggle_agent")} /> opens the agent panel. It runs an{" "}
                <a href={links.acp}>Agent Client Protocol</a> agent as a local program and hands it
                Island&rsquo;s browser tools. Pick the provider in the panel header or in Settings →
                Agent &amp; tools; a custom command or <code>ISLAND_AGENT_COMMAND</code> runs any
                other ACP agent. Replies stream in as Markdown, tool calls that need approval ask
                first, <Keys combo={["Esc"]} /> stops a turn, and the agent is told which tab you are
                looking at. {sevenTag} In the Native look the Agent button sits at the bottom of the
                sidebar.
              </p>
              <div className="table-wrap">
                <table className="data-table stack">
                  <thead>
                    <tr>
                      <th scope="col">Provider</th>
                      <th scope="col">Command</th>
                      <th scope="col">Needs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acpProviders.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>
                          <code>{p.command}</code>
                        </td>
                        <td>{p.needs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 id="mcp">Island&rsquo;s tools for any agent (MCP)</h3>
              <p>
                While Island runs it serves MCP over Streamable HTTP on{" "}
                <code>http://127.0.0.1:9223/mcp</code> (a random free port if 9223 is taken),
                reachable from this computer only and protected by a bearer token that changes on
                every launch. Settings → Agent &amp; tools shows the exact config with the current
                token; copy it into Claude Code, Claude Desktop, Cursor or any MCP client:
              </p>
              <CodeBlock code={MCP_DOCS_CONFIG} lang="json" filename="mcp.json" />

              <h3 id="bridge">The stdio bridge</h3>
              <p>
                The port and token are also written to <code>agent-endpoint.json</code> in
                Island&rsquo;s data directory, readable only by your user. Clients that only speak
                stdio can use the bundled bridge, which reads that file for them:
              </p>
              <CodeBlock code={mcpBridgeConfig} lang="json" filename="mcp.json" />

              <h3 id="tools">The tools</h3>
              <div className="table-wrap">
                <table className="data-table stack">
                  <thead>
                    <tr>
                      <th scope="col">Tool</th>
                      <th scope="col">What it does</th>
                    </tr>
                  </thead>
                  <tbody>
                    {toolGroups.map((g) => (
                      <tr key={g.label}>
                        <td>
                          <span className="flex flex-wrap gap-x-2 gap-y-1">
                            {g.tools.map((t, i) => (
                              <code key={t}>
                                {t}
                                {i < g.tools.length - 1 ? "," : ""}
                              </code>
                            ))}
                          </span>
                        </td>
                        <td>
                          {g.description.includes("http(s)") ? (
                            <>
                              Open or load an <code>http(s)</code> URL
                            </>
                          ) : (
                            g.description
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 id="environment">Environment variables</h3>
              <p>Set these before launching Island (or the bridge).</p>
              <div className="table-wrap">
                <table className="data-table stack">
                  <thead>
                    <tr>
                      <th scope="col">Variable</th>
                      <th scope="col">Value</th>
                      <th scope="col">Effect</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ENV_VARS.map((v) => (
                      <tr key={v.name}>
                        <td>
                          <code>{v.name}</code>
                        </td>
                        <td className="whitespace-nowrap font-mono text-[12.5px]">
                          <span className="text-fg-2 sm:hidden">value: </span>
                          {v.value}
                        </td>
                        <td>{v.effect}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DocSection>

            <DocSection id="shortcuts" title="Keyboard shortcuts">
              <p>
                These are the default bindings ({shortcutCount(version)} in Island {version}), shown
                for macOS. On Windows and
                Linux use <Keys combo={["Ctrl"]} /> wherever the table shows <Keys combo={["Cmd"]} />{" "}
                and <Keys combo={["Alt"]} /> for <Keys combo={["Opt"]} />;{" "}
                <Keys combo={["Control"]} /> is the Control key on every platform. On macOS,{" "}
                <Keys combo={["Cmd", "1"]} /> to <Keys combo={["Cmd", "8"]} /> select a tab and{" "}
                <Keys combo={["Cmd", "9"]} /> the last one; those are fixed menu items.
              </p>
              {shortcutGroups.map((group) => (
                <div key={group}>
                  <h3>{group}</h3>
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th scope="col" className="w-[44%]">
                            Binding
                          </th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shortcuts
                          .filter((s) => s.group === group)
                          .map((s) => (
                            <tr key={s.id}>
                              <td>
                                <Keys combo={macCombo(s.mac)} />
                              </td>
                              <td>
                                {s.action} {s.since && sevenTag}
                                {s.other && (
                                  <span className="block text-[13px] text-fg-2">
                                    Windows and Linux: <Keys combo={otherCombo(s.other)} />
                                  </span>
                                )}
                                {s.note && <span className="block text-[13px] text-fg-2">{s.note}</span>}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              <h3 id="custom-shortcuts">Make them yours</h3>
              <p>
                Open Settings (<Keys combo={comboFor("settings")} />) → Shortcuts, click a shortcut
                and press the new keys; <Keys combo={["Esc"]} /> cancels. Shortcuts need{" "}
                <Keys combo={["Cmd"]} /> / <Keys combo={["Ctrl"]} />, <Keys combo={["Control"]} /> or{" "}
                <Keys combo={["Alt"]} />, except the function keys. Each row, or all of them, can be
                reset to the default. Changes are saved in <code>prefs.json</code>; on macOS the menu
                picks them up at the next launch.
              </p>
              <p>
                {sevenTag} Keys you already use for another action are not taken silently: an amber
                banner names the other action and offers Replace or Cancel. Unbound actions offer
                &ldquo;Add shortcut&rdquo;, and <Keys combo={comboFor("cheatsheet")} /> (also Help →
                Keyboard Shortcuts) shows a cheatsheet of the ten most-used bindings with your
                current keys.
              </p>
            </DocSection>

            <DocSection id="import" title="Import">
              <p>
                Island reads other browsers&rsquo; files on your own computer, and nothing is
                uploaded. Import from the welcome card or from Settings at any time:
              </p>
              <ul>
                <li>
                  <strong>Chrome, Edge, Brave and other Chromium-family browsers</strong>: bookmarks.
                </li>
                <li>
                  <strong>Safari</strong>: bookmarks, where macOS lets Island read them.
                </li>
                <li>
                  <strong>Firefox</strong>: bookmarks from the newest automatic bookmark backup of any
                  profile.
                </li>
                <li>
                  <strong>Arc</strong>: your spaces, with their names, colors and pinned tabs.
                  Imported spaces are added next to yours and never replace them.
                </li>
              </ul>
              <p>
                Downloads are saved straight into your Downloads folder under the suggested name; an
                existing file is never overwritten (<code>name (1).ext</code>).
              </p>
            </DocSection>

            <DocSection id="updates" title="Updates">
              <p>
                Island checks its GitHub releases shortly after startup, at most once a day, or when
                you ask in Settings → Updates. It downloads the archive for your platform, verifies
                it against the release&rsquo;s <code>SHA256SUMS.txt</code>, and swaps it in only when
                you choose <strong>Restart to update</strong>, keeping the previous version as a
                backup until the new one starts. Prereleases are opt-in. Builds run from a CMake build
                directory never update themselves.
              </p>
              <p>
                Builds are unsigned prereleases for now, so macOS Gatekeeper and Windows SmartScreen
                warn before the first launch; the <Link href="/download/">download page</Link>{" "}
                explains what to do. To turn the update checks off, set{" "}
                <code>ISLAND_DISABLE_UPDATES=1</code> before launching.
              </p>
              <CodeBlock code="$ ISLAND_DISABLE_UPDATES=1 open build/src/main/island_browser.app" />
            </DocSection>

            <DocSection id="testing" title="Smoke test and test suites">
              <p>
                A documented smoke run proves that startup stays local and shutdown stays clean. It
                opens a fixed local <code>data:</code> page with no external requests and exits
                through the normal CEF close lifecycle; afterwards no helper process should be left.
              </p>
              <CodeBlock
                code={`$ open build/src/main/island_browser.app --args --island-smoke-test
$ pgrep -fl island_browser || true`}
              />
              <p>
                Four lanes run independently; <code>ctest -N</code> lists what a build directory
                contains.
              </p>
              <h3>Default suite</h3>
              <p>The browser build&rsquo;s GoogleTest suite, which the quick start runs.</p>
              <CodeBlock code="$ ctest --test-dir build --output-on-failure" />
              <h3>Search kernel (opt-in)</h3>
              <p>
                The search kernel under <code>src/search/</code> is guarded by{" "}
                <code>ISLAND_ENABLE_SEARCH</code> (<code>OFF</code> by default) and builds without
                CEF.
              </p>
              <CodeBlock
                code={`$ cmake -B build-search -S src/search -DISLAND_ENABLE_SEARCH=ON
$ cmake --build build-search
$ ctest --test-dir build-search --output-on-failure`}
              />
              <h3>Agent kernel</h3>
              <p>
                The MCP endpoint, the browser tools and the ACP client under <code>src/agent/</code>{" "}
                are CEF-free and build on their own.
              </p>
              <CodeBlock
                code={`$ cmake -B build-agent -S src/agent
$ cmake --build build-agent
$ ctest --test-dir build-agent --output-on-failure`}
              />
              <h3>Python suites</h3>
              <p>
                The dependency lock model, packaging checks, the design-token contract and the
                version tooling run under pytest.
              </p>
              <CodeBlock code="$ python3 -m pytest tests/deps tests/package tests/design tests/version" />
            </DocSection>

            <DocSection id="versions" title="Versions and releases">
              <p>
                Island uses <a href={links.semver}>Semantic Versioning</a>. The version lives in one
                place, the <code>VERSION</code> file, and feeds the build, the About page, the agent
                protocols, the macOS bundle and this site. The{" "}
                <Link href="/changelog/">changelog</Link> lists what changed in each release.
              </p>
              <CodeBlock
                code={`$ python3 scripts/version.py show
$ python3 scripts/version.py bump minor
$ python3 scripts/version.py check`}
              />
              <p>
                <code>bump</code> moves the Unreleased notes in <code>CHANGELOG.md</code> under the new
                version; <code>check</code> fails if anything is out of step. When a version bump
                reaches <code>main</code>, the commit is tagged <code>vX.Y.Z</code> and this site
                rebuilds from the new changelog. Between versions, a moving{" "}
                <a href={links.nightly}>nightly</a> prerelease carries the packages of the latest
                packaging run.
              </p>
            </DocSection>

            <DocSection id="project-layout" title="How the code is organized">
              <ul>
                <li>
                  <code>src/main/</code>: the browser: the native window, chrome views, the palettes,
                  Settings, All tabs, the start page, Reader, Research and the stores behind them.
                </li>
                <li>
                  <code>src/agent/</code>: the CEF-free agent kernel: the MCP endpoint and tools, the
                  ACP client and the stdio bridge.
                </li>
                <li>
                  <code>src/content_blocker_ffi/</code>: the Rust bridge to Brave&rsquo;s{" "}
                  <code>adblock</code> engine, pinned by its <code>Cargo.lock</code>.
                </li>
                <li>
                  <code>src/search/</code>: the opt-in search kernel.
                </li>
                <li>
                  <code>tests/</code>: the GoogleTest suites and the Python suites.
                </li>
                <li>
                  <code>docs/superpowers/</code>: the accepted spec and plan for each phase.
                </li>
              </ul>
            </DocSection>

            <DocSection id="status" title="Honest status">
              <p>
                Island {version} is an unsigned prerelease. Every release is packaged for six
                targets, but only macOS on Apple silicon has been built and run on real hardware;
                the other five still need platform verification. There are no signed or notarized
                builds yet, so the operating system warns before the first launch.
              </p>
              <p>
                Island does not support browser-store extensions, and it declines site permission
                requests for now. Nothing on this site is a promise about dates or platforms, only a description
                of the repository as it stands; <Link href="/#next">Coming next</Link> is a
                direction, not a schedule.
              </p>
            </DocSection>
          </div>
        </div>
      </div>
    </div>
  );
}
