import type { Metadata } from "next";
import {
  Bowlby_One,
  Lexend,
  Poppins,
  Road_Rage,
  Roboto,
  Roboto_Mono,
} from "next/font/google";
import Layout from "@/components/Layout";
import CurrencyProvider from "@/components/providers/CurrencyProvider";
import CartDrawer from "@/components/shop/cart/ui/components/CartDrawer";
import { SanityLive } from "@/sanity/lib/live";
import { getStoreSettings } from "@/sanity/queries";
import { isCurrencyCode, type CurrencyRates } from "@/lib/currencies";

import "../globals.css";

const roadRage = Road_Rage({
  subsets: ["latin"],
  variable: "--font-road-rage",
  weight: ["400"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Danielinniel - Digital Artist",
    template: "%s | Danielinniel",
  },
  description:
    "DANIELINNIEL is a digital artist focused on illustration, concept art, and motion graphics. His work blends emotional storytelling with bold, character-driven visuals. Through Inn & Iel, he explores identity, mythology, and human connection.",
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getStoreSettings();
  const initialRates: CurrencyRates = {};
  for (const entry of settings?.ratesToNGN ?? []) {
    if (isCurrencyCode(entry?.code) && typeof entry?.rate === "number") {
      initialRates[entry.code] = entry.rate;
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roadRage.variable} ${robotoMono.variable} font-sans relative antialiased`}
      >
        <CurrencyProvider initialRates={initialRates}>
          <Layout>{children}</Layout>
          <CartDrawer />
        </CurrencyProvider>
        <SanityLive />
      </body>
    </html>
  );
}
