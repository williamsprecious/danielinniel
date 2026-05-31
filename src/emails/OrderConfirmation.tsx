/**
 * Customer order confirmation. For digital-only orders the `downloads` prop is
 * supplied and the download links are shown inline (one combined email);
 * physical / mixed orders omit it.
 */
import { Text } from "react-email";
import { EmailLayout } from "./components/EmailLayout";
import { OrderItemsTable } from "./components/OrderItemsTable";
import {
  AddressBlock,
  Block,
  Divider,
  DownloadList,
  Hero,
  Lead,
} from "./components/parts";
import { brand, shopUrl } from "./theme";
import type { DownloadItem, EmailOrder } from "./types";

type OrderConfirmationProps = {
  order: EmailOrder;
  downloads?: DownloadItem[];
};

export default function OrderConfirmation({
  order,
  downloads,
}: OrderConfirmationProps) {
  const hasDownloads = !!downloads && downloads.length > 0;

  return (
    <EmailLayout
      preview={`Order ${order.orderNumber} confirmed — thank you for your purchase`}
    >
      <Hero eyebrow="Order confirmed" title={`Thank you, ${order.customer.firstName}.`}>
        <Lead>
          Your payment went through and your order is confirmed. Here&apos;s a
          summary of order{" "}
          <span style={{ color: brand.heading, fontWeight: 700 }}>
            {order.orderNumber}
          </span>
          .
        </Lead>
      </Hero>

      <Divider />

      <OrderItemsTable
        items={order.items}
        subtotalNGN={order.subtotalNGN}
        shippingFeeNGN={order.shippingFeeNGN}
        totalNGN={order.totalNGN}
        showShipping={!order.isDigitalOnly}
      />

      {hasDownloads && (
        <>
          <Divider />
          <DownloadList downloads={downloads} />
        </>
      )}

      {order.shippingAddress && (
        <>
          <Divider />
          <AddressBlock address={order.shippingAddress} />
        </>
      )}

      <Divider />

      <Block>
        <Text
          className="m-0 text-[14px] font-medium leading-[22px]"
          style={{ color: brand.body }}
        >
          {order.isDigitalOnly
            ? "Enjoy your files. "
            : "We'll let you know as soon as your order ships. "}
          If you have any questions, feel free to contact us and we&apos;ll be
          happy to help.
        </Text>
      </Block>
    </EmailLayout>
  );
}

OrderConfirmation.PreviewProps = {
  order: {
    orderNumber: "DI-2026-0042",
    customer: {
      firstName: "Ada",
      lastName: "Okafor",
      email: "ada@example.com",
      phone: "+2348012345678",
    },
    items: [
      {
        title: "Inn & Iel — Limited Print",
        variantTitle: "A2 / Matte",
        type: "physical",
        qty: 1,
        unitPriceNGN: 45000,
        lineTotalNGN: 45000,
        imageAssetRef: null,
        imageUrl: `${shopUrl}/inn%26-iel-nft1.webp`,
      },
      {
        title: "Concept Art Brush Pack",
        variantTitle: null,
        type: "digital",
        qty: 1,
        unitPriceNGN: 12000,
        lineTotalNGN: 12000,
        imageAssetRef: null,
        imageUrl: `${shopUrl}/inn%26-iel-nft2.webp`,
      },
    ],
    subtotalNGN: 57000,
    shippingFeeNGN: 3500,
    totalNGN: 60500,
    isDigitalOnly: false,
    shippingAddress: {
      firstName: "Ada",
      lastName: "Okafor",
      line1: "14 Marina Road",
      line2: "Apt 3B",
      city: "Lagos",
      state: "Lagos",
      postalCode: "101001",
      country: "Nigeria",
      phone: "+2348012345678",
    },
  },
  downloads: [
    { title: "Concept Art Brush Pack", url: "https://example.com/file.zip" },
  ],
} satisfies OrderConfirmationProps;
