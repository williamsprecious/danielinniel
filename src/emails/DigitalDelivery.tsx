/**
 * Standalone digital-delivery email — sent for MIXED carts (physical + digital),
 * where the order confirmation covers the whole order and this email delivers
 * just the digital files. (Digital-only orders get the files inline in the
 * confirmation instead.)
 */
import { EmailLayout } from "./components/EmailLayout";
import { Divider, DownloadList, Hero, Lead } from "./components/parts";
import { brand } from "./theme";
import type { DownloadItem } from "./types";

type DigitalDeliveryProps = {
  firstName: string;
  orderNumber: string;
  downloads: DownloadItem[];
};

export default function DigitalDelivery({
  firstName,
  orderNumber,
  downloads,
}: DigitalDeliveryProps) {
  return (
    <EmailLayout preview={`Your downloads for order ${orderNumber} are ready`}>
      <Hero eyebrow="Your downloads are ready" title={`Here are your files, ${firstName}.`}>
        <Lead>
          The digital items from order{" "}
          <span style={{ color: brand.heading, fontWeight: 700 }}>
            {orderNumber}
          </span>{" "}
          are ready to download below. Any physical items are on their way
          separately.
        </Lead>
      </Hero>

      <Divider />

      <DownloadList downloads={downloads} />
    </EmailLayout>
  );
}

DigitalDelivery.PreviewProps = {
  firstName: "Ada",
  orderNumber: "DI-2026-0042",
  downloads: [
    { title: "Concept Art Brush Pack", url: "https://example.com/file.zip" },
    {
      title: "Character Design Reference Sheet",
      url: "https://example.com/sheet.pdf",
    },
  ],
} satisfies DigitalDeliveryProps;
