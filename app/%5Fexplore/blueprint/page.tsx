import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";

import { getVersion } from "@/lib/data";

import { NativeMockup } from "../_shared/native-mockup";
import { heroLede, pillars, research, sevenLabel } from "../_shared/copy";
import b from "./blueprint.module.css";

export const metadata = { title: "Explore: Blueprint", robots: { index: false } };

const STEPS = [
  { kicker: "Question", title: "Ask on the start page", text: "Pick Research and type the question." },
  { kicker: "Plan", title: "Review the graph", text: "Skip, restore, branch or expand steps." },
  { kicker: "Run", title: "Approve and watch", text: "Run plan, or one branch only." },
  { kicker: "Result", title: "Read the report", text: "Cited Markdown in a Report tab." },
];

/**
 * Direction 3 ("Blueprint"): the page is drawn as one of Island's research plans. Editorial Geist
 * type on a dot-grid canvas; the four product areas are the plan's labelled branches, and the
 * plan collapses into its List view on narrow screens.
 */
export default function BlueprintExplore() {
  const version = getVersion();
  const seven = sevenLabel(version);
  return (
    <div className={b.root}>
      <section className={b.hero} aria-labelledby="b-hero">
        <div className={b.heroCopy}>
          <p className={b.mono}>
            Island {version} · <span className={b.coming}>{seven}: Native look, Plan tab</span>
          </p>
          <h1 id="b-hero" className={b.display}>
            Browse. Read.
            <br />
            Plan, then act.
          </h1>
          <p className={b.lede}>{heroLede}</p>
          <div className={b.actions}>
            <Link href="/download/" className="btn btn-primary">
              <Download className="size-4" aria-hidden /> Download {version}
            </Link>
            <Link href="/docs/" className="btn btn-secondary">
              Read the docs <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>

        <ol className={b.plan} aria-label="What Island does, drawn as a plan">
          <li className={b.question}>
            <span className={b.kicker}>Question</span>
            <b>What does Island do?</b>
          </li>
          <li className={b.branches}>
            <ol>
              {pillars.map((p) => (
                <li key={p.id} className={b.branch} data-branch={p.branch}>
                  <span className={b.kicker}>
                    Branch {p.branch} · {p.title}
                  </span>
                  <ul>
                    {p.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </li>
          <li className={b.result}>
            <span className={b.kicker}>Result</span>
            <Link href="/download/" className={b.resultLink}>
              Island {version} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </li>
        </ol>
      </section>

      <div className={b.stage}>
        <NativeMockup />
      </div>

      <section className={b.block} aria-labelledby="b-research">
        <div className={b.blockHead}>
          <p className={b.mono}>
            {research.label} · <span className={b.coming}>{seven}: Plan tab</span>
          </p>
          <h2 id="b-research" className={b.h2}>
            {research.title}
          </h2>
          <p className={b.lede}>{research.body}</p>
        </div>
        <ol className={b.lane}>
          {STEPS.map((st, i) => (
            <li key={st.kicker} className={b.step}>
              <span className={b.kicker}>
                {String(i + 1).padStart(2, "0")} · {st.kicker}
              </span>
              <b>{st.title}</b>
              <span>{st.text}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
