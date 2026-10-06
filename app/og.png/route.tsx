import { readFileSync } from "node:fs";
import path from "node:path";

import { ImageResponse } from "next/og";

import { getVersion } from "@/lib/data";

// Served as /og.png (a real .png file in the static export, so hosts send image/png).
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

const fontDir = path.join(process.cwd(), "node_modules/geist/dist/fonts");
const font = (file: string) => readFileSync(path.join(fontDir, file));

// Graphite dark tokens.
const BG = "#0A0A0A";
const TEXT = "#EDEDED";
const TEXT_2 = "#A1A1A1";
const BORDER = "#2A2A2A";

function Cross({ x, y }: { x: number; y: number }) {
  return (
    <div style={{ position: "absolute", left: x - 8, top: y - 8, width: 17, height: 17, display: "flex" }}>
      <div style={{ position: "absolute", left: 8, top: 0, width: 1, height: 17, background: "#555" }} />
      <div style={{ position: "absolute", left: 0, top: 8, width: 17, height: 1, background: "#555" }} />
    </div>
  );
}

export function GET() {
  const version = getVersion();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: BG, position: "relative", fontFamily: "Geist" }}>
        <div style={{ position: "absolute", left: 80, top: 0, bottom: 0, width: 1, background: BORDER }} />
        <div style={{ position: "absolute", right: 80, top: 0, bottom: 0, width: 1, background: BORDER }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 96, height: 1, background: BORDER }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 96, height: 1, background: BORDER }} />
        <Cross x={80} y={96} />
        <Cross x={1120} y={96} />
        <Cross x={80} y={534} />
        <Cross x={1120} y={534} />
        <div style={{ position: "absolute", left: 128, top: 34, display: "flex", alignItems: "center", gap: 14, color: TEXT, fontSize: 30, fontWeight: 600 }}>
          <svg width="34" height="34" viewBox="0 0 32 32">
            <path fill={TEXT} d="M5 20.5c3.2-1.1 5.3-4.2 6.2-9.4 3.5 1.9 5.5 5 6 9.4 3.6-1 6.7-.5 9.8 1.8-4.7 4.3-13.7 5.3-22 1.1Z" />
          </svg>
          Island
        </div>
        <div style={{ position: "absolute", right: 128, top: 40, display: "flex", fontFamily: "Geist Mono", fontSize: 20, color: TEXT_2, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "4px 14px" }}>
          v{version}
        </div>
        <div style={{ position: "absolute", left: 128, right: 128, top: 150, display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Geist Mono", fontSize: 20, letterSpacing: 2, color: TEXT_2 }}>
            AN OPEN-SOURCE NATIVE BROWSER
          </div>
          <div style={{ marginTop: 28, fontSize: 84, fontWeight: 600, lineHeight: 1, letterSpacing: -4, color: TEXT }}>
            A calm browser, with an agent at your side.
          </div>
        </div>
        <div style={{ position: "absolute", left: 128, right: 128, bottom: 36, display: "flex", justifyContent: "space-between", fontFamily: "Geist Mono", fontSize: 20, color: TEXT_2 }}>
          <span>CEF · spaces · split view · ACP agent · MCP tools</span>
          <span style={{ display: "flex", gap: 10 }}>
            <span style={{ width: 12, height: 12, borderRadius: 99, background: "#0090FF", marginTop: 6 }} />
            <span style={{ width: 12, height: 12, borderRadius: 99, background: "#30A46C", marginTop: 6 }} />
            <span style={{ width: 12, height: 12, borderRadius: 99, background: "#E5484D", marginTop: 6 }} />
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: font("geist-sans/Geist-SemiBold.ttf"), weight: 600, style: "normal" },
        { name: "Geist Mono", data: font("geist-mono/GeistMono-Regular.ttf"), weight: 400, style: "normal" },
      ],
    },
  );
}
