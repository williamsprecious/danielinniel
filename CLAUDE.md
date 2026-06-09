# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Turbopack, default in Next.js 16)
npm run build        # Production build
npm run start        # Start production server
npm run prod         # Build + start in one command
npm run lint         # ESLint
npm run typegen      # Regenerate Sanity TypeScript types from schema
```

`typegen` must be re-run whenever Sanity schema types (`src/sanity/schemaTypes/`) or queries (`src/sanity/queries/`) change.

## Architecture

This is a Next.js 16 App Router portfolio site for a digital artist. Content is managed in Sanity CMS; emails are sent via AWS SES.

### Route Structure

```
app/
├── (site)/                 # Outer group — owns CurrencyProvider + CartBootRevalidator + SanityLive
│   ├── layout.tsx          # Server: seeds storeSettings.ratesToNGN into CurrencyProvider
│   ├── (client)/           # Public-facing site (includes Layout + CartDrawer)
│   │   ├── page.tsx        # Home
│   │   ├── about/
│   │   ├── works/
│   │   ├── cover-art/[grade]/   # essential | advanced
│   │   ├── design/[conceptType]/  # concept-art | character-design | logo | fashion
│   │   └── shop/[slug]/    # Product detail
│   └── (checkout)/         # Sibling group — minimal header, no Layout/CartDrawer
│       ├── checkout/       # URL: /checkout
│       └── order/          # URL: /order — renders the order for ?reference (Paystack callback)
└── admin/studio/[[...tool]]/    # Sanity Studio (mounted here, not /studio)
```

Dynamic route params are validated against allowed values via `checkValidParams` — invalid params 404.

### Data Layer

- **Sanity** is the content source. Document types: `featured` (homepage showcase), `gallery` (portfolio items), `product`, `category`, `order`, `storeSettings` (singleton), plus the `address` object type.
- `storeSettings` is a true singleton: fixed `documentId: "storeSettings"`, hidden from "New document" menu, delete/duplicate/unpublish stripped in `sanity.config.ts`.
- Queries are split across `src/sanity/queries/` — `index.ts` (general), `products.ts` (shop), `fragments.ts` (reused GROQ snippets). All use `defineQuery` for TypeGen compatibility.
- Data fetching uses `sanityFetch` from `src/sanity/lib/live.ts` — this enables the Live Content API for real-time updates. Always pair with `<SanityLive />` in layouts.
- `sanityFetch` is server-only. For client components that need Sanity data (e.g. infinite scroll gallery), call it through a Server Action in `src/actions/`.
- For **server-side writes and fresh reads** (Inngest, scripts), use `backendClient` from `src/sanity/lib/backendClient.ts` — it carries the editor token and has `useCdn: false` so reads are uncached.
- Image URLs are built with `@sanity/image-url` via `src/sanity/lib/image.ts`. Render Sanity images with `import { Image } from "next-sanity/image"` — not `next/image` directly.

### Forms & Email

- Forms use React Hook Form + Zod. Schemas are in `src/schema.ts`.
- Three schemas: project inquiry (`projectSchema`), contact (`contactSchema`), checkout (`checkoutSchema`). Checkout submits through `initializeCheckout` (see Checkout & order pipeline). The `phone` field is an E.164 string validated with `libphonenumber-js`, entered via the custom `PhoneInput` (`src/components/shop/checkout/ui/components/PhoneInput.tsx`) whose country list mirrors the configured shipping zones.
- Contact + project submissions go through server actions in `src/actions/contact.action.ts`.
- Email rendering + sending lives in `src/lib/email/index.tsx`: `renderEmail` renders React Email templates (`src/emails/*`, `react-email`) to HTML + plain text, then sends via the AWS SES client (`src/lib/ses/index.ts`). Senders: `sendContactFormEmail`, `sendProjectInquiryEmail`, `sendOrderConfirmationEmail`, `sendDigitalDeliveryEmail`, `sendAdminOrderEmail`.
- Templates: contact/project (`ContactMessage.tsx`, `ProjectInquiry.tsx`), order pipeline (`OrderConfirmation.tsx`, `DigitalDelivery.tsx`, `AdminOrderNotification.tsx`); shared layout/parts in `src/emails/components/` + tokens in `src/emails/theme.ts`.

### Shop client state

- Cart and currency live in persisted zustand stores: `src/store/cart-store.ts` and `src/store/currency-store.ts`. Both `partialize` to localStorage.
- **Always read via the `useHydrated*` hooks** in components — `useHydratedCart`, `useHydratedSubtotalNGN`, `useHydratedTotalQty`, `useHydratedCurrency`. They return defaults until the persist layer hydrates, preventing flash-of-incorrect-state on SSR. Bump `CART_STORE_VERSION` in `cart-store.ts` to wipe stale persisted carts when `CartLine` shape changes (`migrate` returns empty `lines`).
- Server-seeded rates: `src/app/(site)/layout.tsx` reads `storeSettings.ratesToNGN` server-side and passes them into `<CurrencyProvider initialRates={...}>`. Both `(client)` and `(checkout)` child layouts inherit it — don't re-seed in children.
- Price display: always render via `formatPrice(amountNGN, currency, rates)` from `src/lib/format-price.ts`. Prices are stored in NGN; conversion is display-only.
- Checkout page omits `<Layout>` (header/nav) and `<CartDrawer />` deliberately — focused conversion flow. Any future single-task flow (sign-up wizard, confirmation pages) should use its own route group with the same pattern.

### Cart revalidation

- Cart lines snapshot product info at add-time. To keep them in sync with Sanity, `revalidateCart` (in `src/actions/cart.action.ts`) is called from two spots: `CartBootRevalidator` (mounted in `src/app/(site)/layout.tsx`, fires once per hard page load) and `CheckoutView` (fires on every checkout mount).
- The store's `isRevalidating` flag is a concurrency guard — on a checkout-page reload both surfaces fire in the same tick; the second call is a synchronous no-op so only one Sanity round-trip happens.
- Revalidation is **silent**: removed/updated lines are applied with no UI banner. The drawer deliberately does NOT revalidate — staleness there is bounded by "until next reload or checkout visit."
- `initializeCheckout` (`src/actions/order.action.ts`) reuses `revalidateCart` server-side before payment and aborts on any removed / qty-clamped / price-changed line, and recomputes the shipping fee via `lookupShippingFee` from a fresh `storeSettings` read.

### Shipping zones

- Configured in admin on `storeSettings.shippingZones` as one entry per supported country. Each top-level entry is its own object type (`shippingZoneNG`, `shippingZoneUS`, `shippingZoneCA`, `shippingZoneGB`) defined in `src/sanity/schemaTypes/objects/shippingZoneTypes.ts` via a small factory — so the Studio "Add" menu shows the 4 country options as distinct nested rows.
- Supported countries are a fixed code-side registry: `src/lib/shipping/supported-countries.ts` (NG, US, CA, GB) with per-country `regionLabel` metadata. Distinct from the generic `src/lib/countries.ts` (60+ ISO list, currently only used by the all-countries combobox).
- Region lists (NG states, US states, CA provinces) live in `src/lib/shipping/regions.ts`. UK has no regions (flat-only).
- All fee lookups go through `lookupShippingFee(zones, country, region?)` in `src/lib/shipping/zone-lookup.ts` — shared between Studio validation, the checkout UI preview, and (eventually) the order-create server action. Precedence: exact region override → country `defaultFeeNGN` → fail.
- Zone fees authored in NGN (`feeNGN` field). On the order document, the snapshot lands in the currency-neutral `shippingFee` field alongside the snapshotted `currency` and `rateToNaira`.

### Checkout & order pipeline (Paystack)

- Payment-first: `initializeCheckout` (`src/actions/order.action.ts`) validates + reprices server-side, then redirects to Paystack. **No order doc is created until payment succeeds** — no stale/pending orders.
- Settlement is always **NGN**; the currency switcher is display-only. Orders store NGN amounts (`currency: "NGN"`, `rateToNaira: 1`).
- The full priced cart snapshot + customer/address travels in **Paystack `metadata`** (no temp docs). `src/lib/paystack/index.ts` wraps initialize/verify + webhook signature.
- Webhook `src/app/api/webhooks/paystack/route.ts` verifies the signature and emits `order/payment.succeeded`; the `process-paid-order` Inngest fn verifies with Paystack, creates the order, and decrements stock. Idempotent via function `idempotency` + deterministic `_id: order.<reference>` + `createIfNotExists`.
- Read an order back with `ORDER_BY_REFERENCE_QUERY` (`payment.reference == $reference`).
- Local dev: the webhook reaches localhost via the ngrok URL in `NEXT_PUBLIC_APP_URL`; set the Paystack dashboard webhook to `${NEXT_PUBLIC_APP_URL}/api/webhooks/paystack`.

### Digital product delivery

- Digital products carry a Sanity `file` field `digitalFile` (`src/sanity/schemaTypes/productType.ts`, shown when `type == "digital"`). Delivery uses the raw `cdn.sanity.io/files/...` asset URL directly — public, permanent, no auth, no expiry. Acceptable here: the project/dataset are already public (`NEXT_PUBLIC_*`, exposed in every image URL), and streaming through our own server to hide the URL would double Vercel bandwidth for marginal benefit.
- Two delivery surfaces, both using the direct CDN URL: emails (`processPaidOrder` `load-digital-files` step resolves `digitalFile.asset->url`; templates `OrderConfirmation.tsx` / `DigitalDelivery.tsx`) and the order page (`ORDER_BY_REFERENCE_QUERY` projects `"downloadUrl": product->digitalFile.asset->url + "?dl="` per item → download buttons in `OrderConfirmationView.tsx`). The order page is a durable re-download source (email isn't the only channel).
- Both surfaces append Sanity's **`?dl=`** query param so the CDN returns `Content-Disposition: attachment` (blank value → the asset's original filename). Required because the HTML `download` attribute is ignored for cross-origin URLs.

### Background Jobs (Inngest)

- Client + function definitions in `src/inngest/`. HTTP handler at `src/app/api/inngest/route.ts`.
- `refresh-currency-rates` (cron `0 0 */2 * *`): reads codes from `storeSettings.ratesToNGN`, fetches from CurrencyAPI, patches rates back. **No-ops** if the array is empty.
- `process-paid-order` (event `order/payment.succeeded`): re-verifies the Paystack txn, creates the order idempotently, decrements inventory. Both functions live in `src/inngest/functions.ts` and are registered in `serve({ functions: [...] })`.
- Local dev: `INNGEST_DEV=1` plus `npx inngest-cli@latest dev` in a second terminal. Trigger functions manually from the dev UI at `http://localhost:8288`.
- Production needs `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY`.

### Security

- Contact form server actions in `src/actions/contact.action.ts` are protected by Arcjet (`src/lib/arcjet.ts`): `shield()` + `slidingWindow` (5 req / 1h per IP). Apply per-route rules via `aj.withRule(...)`, never mutate the shared client.
- Set `ARCJET_ENV=development` locally so localhost IPs get bucketed (otherwise rate limits can't be tested in dev). **Do not** set it in production.

### Styling

- Tailwind CSS v4 + Radix UI + shadcn/ui (New York style).
- Animations: GSAP and Motion (Framer Motion fork).
- Fonts: Road Rage (headlines, `font-heading`) + Roboto Mono (body, `font-sans`), loaded in `src/app/(site)/layout.tsx`. Tokens defined in `src/app/globals.css` `@theme inline` block (`--font-heading`, `--font-sans`).

## Gotchas

- `sanity.types.ts` is auto-generated — never edit manually; changes are overwritten by `typegen`.
- `sanity.cli.ts` has a Vite PostCSS override (`vite: { css: { postcss: { plugins: [] } } }`) — required for `typegen` to run; removing it breaks `npm run typegen` with a PostCSS plugin error.
- TypeScript error `Type '{}' is missing properties from GALLERY_QUERY_RESULT` after moving or renaming query files → stale module augmentation in `sanity.types.ts`; fix by re-running `typegen`.
- **`backendClient` must use `useCdn: false`** — it's a write-enabled client; if reads come from the CDN, you'll read stale state right after a write/publish and downstream logic breaks (e.g., the Inngest cron seeing no codes seconds after they were published).
- **Sanity is schemaless at storage** — changing a field's *type* (e.g., object → array) does not migrate existing documents. Studio renders the new shape against orphan old data, fetches return the old shape. Wipe via Vision mutation or a one-off script in `scripts/`.
- **`backendClient.fetch()` returns published docs**, not drafts. Edits sitting in `drafts.<id>` are invisible until published. Use `*[_id in [id, "drafts." + id]]` if you need either.
- **GSAP ScrollTrigger caches start/end at mount** — async content below pinned sections can desync it. Pattern: add a `ResizeObserver` on `document.body` that calls debounced `ScrollTrigger.refresh()` (see `src/components/About.tsx`).
- **Ad-hoc Sanity maintenance scripts** live in `scripts/`. Run with `node --env-file=.env.local scripts/<name>.mjs` (Node 20+ `--env-file` flag — no `dotenv` needed).
- **Paystack stringifies `metadata`** — numbers come back as `"6"`, booleans as `"true"`. Normalize before writing to Sanity (`dec` rejects strings). See `normalizeMetadata` in `src/inngest/functions.ts`.
- **Paystack `callback_url` must NOT include `?reference`** — Paystack appends its own `reference` + `trxref`, so adding ours duplicates the param (Next parses it as an array). Paystack references are hyphens-only (no underscores).
- **The order confirmation page reads via `backendClient` (`useCdn: false`), not `sanityFetch`** — the order is created out-of-band, and a CDN read caches the empty result (and Live can't surface a `null→created` doc), so it would never appear. The client shell re-runs the read via `router.refresh()` until it lands.
- **Strict React 19 hooks lint is enforced** (`react-hooks/set-state-in-effect`, `set-state-in-render`, `refs`): don't sync state from props via effects or during render, and don't read/write refs during render. Use derived state, event handlers, or a `key` remount instead.

### Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_TOKEN
SANITY_API_READ_TOKEN
AWS_REGION
ACCESS_KEY
SECRET_ACCESS_KEY
CONTACT_EMAIL
CURRENCYAPI_KEY              # Inngest currency-refresh cron
PAYSTACK_SECRET_KEY          # Paystack initialize/verify + webhook signature
NEXT_PUBLIC_APP_URL          # Public base URL (ngrok in dev) — Paystack callback + webhook
ARCJET_KEY                   # Server-action rate limiting
ARCJET_ENV                   # "development" locally, unset in production
INNGEST_DEV                  # "1" in local dev
INNGEST_EVENT_KEY            # production only
INNGEST_SIGNING_KEY          # production only
```
