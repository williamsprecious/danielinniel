import type { Metadata } from "next";
import { Bowlby_One, Roboto } from "next/font/google";
import Layout from "@/components/Layout";
import { SanityLive } from "@/sanity/lib/live";

import "../globals.css";

const bowlby = Bowlby_One({
  subsets: ["latin"],
  variable: "--font-bowlby",
  weight: ["400"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bowlby.variable} ${roboto.variable} font-sans relative antialiased`}
      >
        <Layout>{children}</Layout>
        <SanityLive />
      </body>
    </html>
  );
}
