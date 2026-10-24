import { getLatestRelease } from "@/lib/data";

// Served as /release.txt: the release tag this build shows. The hourly deploy run compares it with
// the browser repo's newest release and rebuilds only when they differ.
export const dynamic = "force-static";

export function GET() {
  return new Response(`${getLatestRelease()?.tag_name ?? "none"}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
