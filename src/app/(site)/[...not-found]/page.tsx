import { notFound } from "next/navigation";

// Catch-all that funnels any unmatched URL into the (site) group so the
// nearest not-found.tsx ((site)/not-found.tsx) is used. Required because:
// 1. There's no top-level app/layout.tsx (admin owns its own html/body).
// 2. Without this, unmatched URLs fall back to Next.js's DefaultLayout,
//    which lacks suppressHydrationWarning and breaks hydration whenever
//    a browser extension injects attributes onto <html> or <body>.
export default function CatchAllNotFound() {
  notFound();
}
