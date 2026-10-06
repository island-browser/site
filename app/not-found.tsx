import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="frame">
      <div className="gutter flex min-h-[64vh] flex-col items-center justify-center py-24 text-center">
        <p className="label mb-4">404</p>
        <h1 className="h1">Nothing is open here.</h1>
        <p className="lede mt-5 max-w-[48ch]">
          That page has moved, or it was never part of this build.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <ArrowLeft className="size-4" aria-hidden /> Back to Island
          </Link>
          <Link href="/docs/" className="btn btn-secondary">
            Read the docs
          </Link>
        </div>
      </div>
    </div>
  );
}
