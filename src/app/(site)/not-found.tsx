import type { Metadata } from "next";
import NotFoundView from "@/components/NotFoundView";

export const metadata: Metadata = {
  title: "Page Not Found | Danielinniel",
  robots: { index: false, follow: false },
};

// Handles notFound() calls thrown from within the (site) route group
// (e.g. /shop/[slug] when a product is missing). Inherits (site)/layout.tsx
// for html/body/fonts/providers/sparkles — DO NOT add <html> here.
export default function SiteNotFound() {
  return <NotFoundView />;
}
