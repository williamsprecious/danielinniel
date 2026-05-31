/**
 * Shared brand tokens + Tailwind config for all transactional emails.
 *
 * Named exports only — no default export — so React Email's preview server
 * (`npm run email`) does not list this file as a renderable template.
 *
 * Design: light receipt aesthetic — white page, a 600px bordered container,
 * edge-to-edge hairline dividers between sections, soft #F7F7F7 emphasis
 * panels, bold black headings and grey body copy. Monochrome, editorial,
 * Outlook-safe (table layouts, inline styles, no float/decoration tricks).
 */
import { pixelBasedPreset } from "react-email";

export const brand = {
  /** Page + content background — white. */
  paper: "#FFFFFF",
  /** Soft grey emphasis panels (top strip, footer, totals). */
  panel: "#F7F7F7",
  /** Hairline borders and full-width dividers. */
  line: "#E5E5E5",
  /** Headlines, item names, primary text, buttons — pure black. */
  heading: "#000000",
  /** Body copy, lead paragraphs — darkened for legibility on white. */
  body: "#3F3F3F",
  /** Key/value metadata values. */
  meta: "#4A4A4A",
  /** Muted fine print, eyebrows, footer legal. */
  muted: "#7A7A7A",
  /** Outline-button border. */
  btn: "#929292",
} as const;

/** Business name shown in the footer and in subjects. */
export const brandName = "DANIELINNIEL";

/** Short studio descriptor for the footer. */
export const brandTagline = "Concept art, illustration and digital design.";

/** Public site base URL (no trailing slash). */
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");

/** Where the footer "visit the shop" link points. */
export const shopUrl = APP_URL || "https://danielinniel.com";

/**
 * Logo image src for the header — environment-aware, no manual switching:
 *
 * - REAL SENDS (Next runtime, `NEXT_PUBLIC_APP_URL` set): absolute
 *   `${APP_URL}/logo.png`, served from `public/logo.png`. Email clients need an
 *   absolute URL, and this works in dev (ngrok) and production (live domain).
 * - PREVIEW SERVER (`npm run email`, no `.env.local`): falls back to
 *   `/static/logo.png`, served from `src/emails/static/`.
 */
export const logoUrl = APP_URL ? `${APP_URL}/logo.png` : "/static/logo.png";

/** Footer social links. */
export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/danielinniel" },
  { label: "X", href: "https://x.com/danielinniel" },
  { label: "TikTok", href: "https://www.tiktok.com/@innielsden" },
  { label: "YouTube", href: "https://www.youtube.com/@danielinniel" },
];

/**
 * Tailwind config shared by every template. `pixelBasedPreset` keeps spacing
 * in px (email clients ignore rem). Brand colours + the Helvetica/Arial sans
 * stack (matching the reference receipt) are exposed as utilities (`bg-paper`,
 * `bg-panel`, `text-heading`, `font-sans`, …).
 *
 * The font is a system stack on purpose — Helvetica Neue / Arial ship on every
 * device, so unlike web-loaded fonts they aren't stripped by Gmail's mobile app
 * and render with correct 400/500/700 weights everywhere.
 */
export const emailTailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        paper: brand.paper,
        panel: brand.panel,
        line: brand.line,
        heading: brand.heading,
        body: brand.body,
        meta: brand.meta,
        muted: brand.muted,
        btn: brand.btn,
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
};
