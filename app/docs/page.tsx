import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { DocSection } from "@/components/docs/doc-section";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";
import { Keys, KeyList } from "@/components/keys";
import { acpProviders, mcpBridgeConfig, shortcuts, toolGroups } from "@/lib/content";
import { getVersion } from "@/lib/data";
import { links } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Docs — build, run, and test",
  path: "/docs/",
  socialTitle: "Island Docs — build, run, and test",
  description:
    "Build, run, and test Island; connect an AI agent over ACP or MCP; customize keyboard shortcuts; import from other browsers; updates; and how Island is versioned.",
});

const TOC: TocItem[] = [
  { id: "quick-start", label: "Quick start" },
  { id: "first-run", label: "First run" },
  { id: "smoke-test", label: "Smoke test" },
  { id: "agents", label: "AI agents" },
  { id: "shortcuts", label: "Keyboard shortcuts" },
  { id: "import", label: "Import" },
  { id: "updates", label: "Updates" },
  { id: "testing", label: "Test suites" },
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
];

export default function DocsPage() {
  const version = getVersion();
  return (
    <div className="frame">
      <div className="gutter border-b border-line py-16 sm:py-20">
        <p className="label mb-4">Island Docs</p>
        <h1 className="h1">Build, run, and test.</h1>
        <p className="lede mt-5 max-w-[64ch]">
          Version <span className="font-mono text-[0.9em] text-fg">{version}</span>. Every command
          below is copied from the repository&rsquo;s own verification docs and is true of the
          current build. If a claim here and the repository disagree, the repository wins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="gutter border-b border-line py-6 lg:border-r lg:border-b-0 lg:!pr-6 lg:py-14">
          <div className="lg:sticky lg:top-24">
            <DocsToc items={TOC} />
          </div>
        </aside>

        <div className="gutter min-w-0 py-14">
          <div className="max-w-[760px]">
            <DocSection id="quick-start" title="Quick start">
              <p>
                From a clean checkout, vendor the pinned dependencies first. The CEF binary
                distribution and the Geist fonts are fetched by <code>scripts/setup_deps.sh</code>{" "}
                from the versions locked in <code>deps/dependencies.lock.json</code>; both land in
                gitignored directories and are never committed.
              </p>
              <CodeBlock
                code={`$ bash -n scripts/setup_deps.sh
$ ./scripts/setup_deps.sh --dry-run
$ ./scripts/setup_deps.sh
$ python3 scripts/deps.py verify`}
              />
              <p>
                The first configure needs network access: GoogleTest v1.15.2 is fetched through CMake{" "}
                <code>FetchContent</code>. Then build and run the default test suite.
              </p>
              <CodeBlock
                code={`$ cmake -B build -S .
$ cmake --build build
$ ctest --test-dir build --output-on-failure`}
              />
              <p>When the suite passes, open the app.</p>
              <CodeBlock code="$ open build/src/main/island_browser.app" />
            </DocSection>

            <DocSection id="first-run" title="First run">
              <p>
                The first launch shows one welcome card that offers, never blocks. It asks how Island
                should look — <code>System</code>, <code>Light</code>, or <code>Dark</code> — and
                lists the browsers found on your machine to import from (see{" "}
                <a href="#import">Import</a>).
              </p>
              <p>
                Press <Keys combo={["Esc"]} /> or choose &ldquo;Just start browsing&rdquo; to skip the
                card. &ldquo;Show Welcome…&rdquo; in the browser menu reopens it, and Settings can
                import again at any time.
              </p>
            </DocSection>

            <DocSection id="smoke-test" title="Smoke test">
              <p>
                The build ships with a documented smoke run that proves startup stays local and
                shutdown stays clean:
              </p>
              <CodeBlock code="$ open build/src/main/island_browser.app --args --island-smoke-test" />
              <p>
                The smoke run opens on a fixed local <code>data:</code> page — no external network
                requests — and exits through the normal CEF close lifecycle. After quitting, check
                that no helper processes are left behind:
              </p>
              <CodeBlock code="$ pgrep -fl island_browser || true" />
            </DocSection>

            <DocSection id="agents" title="AI agents">
              <p>
                Island works with agents in two directions: an agent can run <em>inside</em> the
                browser, in the sidebar, and any agent you already use can drive the browser from
                outside through its tools.
              </p>

              <h3 id="acp">The agent in the sidebar (ACP)</h3>
              <p>
                <Keys combo={["Cmd", "J"]} /> opens the agent panel. It runs an{" "}
                <a href={links.acp}>Agent Client Protocol</a> agent as a local program and hands it
                Island&rsquo;s browser tools automatically. Pick the provider from the panel header or
                in Settings → Agent &amp; tools; a custom command or{" "}
                <code>ISLAND_AGENT_COMMAND</code> runs any other ACP agent. Replies stream in, tool
                calls that need approval ask first, <Keys combo={["Esc"]} /> stops a turn, and the
                agent is told which tab you are looking at.
              </p>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Provider</th>
                      <th>Command</th>
                      <th>Needs</th>
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
                <code>http://127.0.0.1:9223/mcp</code> (a random free port if 9223 is taken;{" "}
                <code>ISLAND_AGENT_PORT</code> picks another, <code>ISLAND_AGENT_ENDPOINT=off</code>{" "}
                turns it off), reachable from this computer only and protected by a bearer token that
                changes on every launch. Settings → Agent &amp; tools shows the exact config with the
                current token; copy it into Claude Code, Claude Desktop, Cursor, or any MCP client:
              </p>
              <CodeBlock code={MCP_DOCS_CONFIG} lang="json" filename="mcp.json" />

              <h3 id="bridge">The stdio bridge</h3>
              <p>
                The port and token are also written to <code>agent-endpoint.json</code> in
                Island&rsquo;s data directory (readable only by your user). Clients that only speak
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
              <p>Set these before launching Island.</p>
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
                These are the defaults, shown for macOS. On Windows and Linux, use{" "}
                <Keys combo={["Ctrl"]} /> wherever the table shows <Keys combo={["Cmd"]} /> and{" "}
                <Keys combo={["Alt"]} /> for <Keys combo={["Opt"]} />.
              </p>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Binding</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shortcuts.map((s) => (
                      <tr key={s.action}>
                        <td className="whitespace-nowrap">
                          <KeyList combos={s.combos} separator={s.separator} />
                        </td>
                        <td>
                          {s.action}
                          {s.note && <span className="text-fg-2"> ({s.note})</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3 id="custom-shortcuts">Make them yours</h3>
              <p>
                Open Settings (<Keys combo={["Cmd", ","]} />) → Keyboard shortcuts, click a shortcut,
                and press the new keys; <Keys combo={["Esc"]} /> cancels. Shortcuts need{" "}
                <Keys combo={["Cmd"]} /> / <Keys combo={["Ctrl"]} /> or <Keys combo={["Alt"]} />,
                except the function keys. Two actions sharing keys are flagged, and each row — or all
                of them — can be reset to the default. Your changes are saved in{" "}
                <code>prefs.json</code>; on macOS the menu picks them up at the next launch.
              </p>
            </DocSection>

            <DocSection id="import" title="Import">
              <p>
                Island reads other browsers&rsquo; files on your own computer — nothing is uploaded —
                from the welcome card or from Settings → Import at any time:
              </p>
              <ul>
                <li>
                  <strong>Chrome, Edge, Brave, and other Chromium-family browsers</strong> —
                  bookmarks.
                </li>
                <li>
                  <strong>Safari</strong> — bookmarks, where macOS lets Island read them.
                </li>
                <li>
                  <strong>Firefox</strong> — bookmarks from the newest automatic bookmark backup of any
                  profile.
                </li>
                <li>
                  <strong>Arc</strong> — your spaces, with their names, colors, and pinned tabs.
                  Imported spaces are added next to yours and never replace them.
                </li>
              </ul>
            </DocSection>

            <DocSection id="updates" title="Updates">
              <p>
                Island checks GitHub Releases for a newer build. When one is available, Settings
                offers <strong>Restart to update</strong>; nothing is installed until you choose it.
              </p>
              <p>
                Builds are unsigned prereleases for now, so macOS Gatekeeper and Windows SmartScreen
                warn before the first launch — the <Link href="/download/">download page</Link>{" "}
                explains how to open them and how to check the archives against{" "}
                <code>SHA256SUMS.txt</code>. To turn the update checks off, set{" "}
                <code>ISLAND_DISABLE_UPDATES=1</code> before launching.
              </p>
              <CodeBlock code="$ ISLAND_DISABLE_UPDATES=1 open build/src/main/island_browser.app" />
            </DocSection>

            <DocSection id="testing" title="Test suites">
              <p>
                Four lanes run independently. Counts below are from <code>main</code> as of
                2026-09-19; the numbers grow as units land, so rerun <code>ctest -N</code> after
                pulling.
              </p>
              <h3>Default suite</h3>
              <p>
                The browser build&rsquo;s GoogleTest suite — 242 tests as of 2026-09-19. This is what
                the quick-start commands above run.
              </p>
              <CodeBlock code="$ ctest --test-dir build --output-on-failure" />
              <h3>Search kernel (opt-in)</h3>
              <p>
                The Phase S0 search kernel under <code>src/search/</code> is guarded by{" "}
                <code>ISLAND_ENABLE_SEARCH</code>, declared <code>OFF</code> by default. It builds
                without CEF and without the vendored dependencies — 150 tests as of 2026-09-19, or 361
                when built together with the browser from the repository root.
              </p>
              <CodeBlock
                code={`$ cmake -B build-search -S src/search -DISLAND_ENABLE_SEARCH=ON
$ cmake --build build-search
$ ctest --test-dir build-search --output-on-failure`}
              />
              <h3>Agent kernel</h3>
              <p>
                The MCP endpoint, the browser tools, and the ACP client under <code>src/agent/</code>{" "}
                are CEF-free and build on their own, without the vendored dependencies.
              </p>
              <CodeBlock
                code={`$ cmake -B build-agent -S src/agent
$ cmake --build build-agent
$ ctest --test-dir build-agent --output-on-failure`}
              />
              <h3>Python suites</h3>
              <p>
                The dependency lock model, packaging checks, the design-token contract, and the
                version tooling run under pytest, separate from <code>ctest</code>.
              </p>
              <CodeBlock code="$ python3 -m pytest tests/deps tests/package tests/design tests/version" />
            </DocSection>

            <DocSection id="versions" title="Versions and releases">
              <p>
                Island uses <a href={links.semver}>Semantic Versioning</a>. The version lives in one
                place — the <code>VERSION</code> file — and feeds the build, the app&rsquo;s About
                page, the agent protocols, the macOS bundle, and this site. The{" "}
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
                reaches <code>main</code>, the commit is tagged <code>vX.Y.Z</code> automatically and
                this site rebuilds from the new changelog.
              </p>
              <p>
                Between versions, a moving <a href={links.nightly}>nightly</a> prerelease carries the
                packages from the latest completed packaging run. Every archive in it is unsigned and
                not notarized; verify it against the release&rsquo;s <code>SHA256SUMS.txt</code>{" "}
                before running it. Signed, notarized public builds are still to come.
              </p>
            </DocSection>

            <DocSection id="project-layout" title="How the code is organized">
              <ul>
                <li>
                  <code>src/main/</code> — the browser: the native window, chrome views, the
                  palettes, Settings and All tabs, and the stores behind them.
                </li>
                <li>
                  <code>src/agent/</code> — the CEF-free agent kernel: the MCP endpoint and tools, the
                  ACP client, and the stdio bridge.
                </li>
                <li>
                  <code>src/search/</code> — the opt-in Phase S0 search kernel, guarded by{" "}
                  <code>ISLAND_ENABLE_SEARCH</code> (<code>OFF</code> by default).
                </li>
                <li>
                  <code>tests/</code> — the GoogleTest suites and the Python suites for dependencies,
                  packaging, and design tokens.
                </li>
                <li>
                  <code>docs/superpowers/</code> — the accepted spec and plan for each phase; only
                  units of accepted plans get implemented.
                </li>
                <li>
                  <code>scripts/setup_deps.sh</code> — vendors the pinned CEF distribution and the
                  Geist fonts from <code>deps/dependencies.lock.json</code> into gitignored
                  directories.
                </li>
              </ul>
            </DocSection>

            <DocSection id="status" title="Honest status">
              <p>
                Working today: tabs, spaces, and pinned tabs; split view with a keyboard-adjustable
                divider; the command and search palettes; the all-tabs overview; Settings with
                customizable shortcuts; session restore after a clean quit; import from
                Chromium-family browsers, Safari, Firefox, and Arc; the agent panel; and the MCP tools
                endpoint. Each is covered by the automated suites above.
              </p>
              <p>
                Still outstanding: a manual and visual acceptance pass, refreshed CI and packaging
                evidence, integration regression coverage, and signed, notarized public releases.
                Until those land, Island is a development build you run from source. Nothing on this
                page is a promise about dates or platforms — only a description of the repository as
                it stands.
              </p>
            </DocSection>
          </div>
        </div>
      </div>
    </div>
  );
}
