/**
 * Internal order notification sent to the store inbox (CONTACT_EMAIL). Operational
 * detail: customer, items, totals, address, payment reference and any admin notes
 * (e.g. currency-mismatch warnings from the order processor).
 */
import { Section } from "react-email";
import { EmailLayout } from "./components/EmailLayout";
import { OrderItemsTable } from "./components/OrderItemsTable";
import {
  AddressBlock,
  Block,
  Divider,
  Hero,
  InfoRow,
  Lead,
  MetaPair,
  SectionTitle,
} from "./components/parts";
import { shopUrl } from "./theme";
import { formatNGN, type EmailOrder } from "./types";

type AdminOrderNotificationProps = {
  order: EmailOrder;
};

const formatDateTime = (iso?: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toUTCString();
};

export default function AdminOrderNotification({
  order,
}: AdminOrderNotificationProps) {
  const digitalCount = order.items.filter((i) => i.type === "digital").length;
  const physicalCount = order.items.length - digitalCount;

  return (
    <EmailLayout
      internal
      preview={`New order ${order.orderNumber} — ${formatNGN(order.totalNGN)}`}
    >
      <Hero eyebrow="New order received" title={order.orderNumber}>
        <Lead>
          {physicalCount} physical · {digitalCount} digital ·{" "}
          {order.isDigitalOnly ? "digital-only" : "needs fulfilment"}
        </Lead>
      </Hero>

      <Divider />

      <Block>
        <SectionTitle>Customer</SectionTitle>
        <InfoRow
          label="Name"
          value={`${order.customer.firstName} ${order.customer.lastName}`}
        />
        <InfoRow label="Email" value={order.customer.email} />
        <InfoRow label="Phone" value={order.customer.phone} />
      </Block>

      <Divider />

      <OrderItemsTable
        items={order.items}
        subtotalNGN={order.subtotalNGN}
        shippingFeeNGN={order.shippingFeeNGN}
        totalNGN={order.totalNGN}
        showShipping={!order.isDigitalOnly}
      />

      {order.shippingAddress && (
        <>
          <Divider />
          <AddressBlock address={order.shippingAddress} />
        </>
      )}

      <Divider />

      <Block>
        <SectionTitle>Payment</SectionTitle>
        <MetaPair
          leftLabel="Provider"
          leftValue="Paystack"
          rightLabel="Charged"
          rightValue={formatNGN(order.totalNGN)}
        />
        <Section className="mt-[16px]">
          <MetaPair
            leftLabel="Reference"
            leftValue={order.reference ?? "—"}
            rightLabel="Viewed in"
            rightValue={order.displayCurrency ?? "NGN"}
          />
        </Section>
        <Section className="mt-[16px]">
          <InfoRow label="Paid at" value={formatDateTime(order.paidAt)} />
        </Section>
      </Block>
    </EmailLayout>
  );
}

AdminOrderNotification.PreviewProps = {
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
        imageUrl: `${shopUrl}/inn%26-iel-nft3.webp`,
      },
      {
        title: "Concept Art Brush Pack",
        variantTitle: null,
        type: "digital",
        qty: 1,
        unitPriceNGN: 12000,
        lineTotalNGN: 12000,
        imageAssetRef: null,
        imageUrl: `${shopUrl}/inn%26-iel-nft4.webp`,
      },
    ],
    subtotalNGN: 57000,
    shippingFeeNGN: 3500,
    totalNGN: 60500,
    isDigitalOnly: false,
    reference: "di_abc123def456",
    paidAt: "2026-05-30T10:24:00.000Z",
    displayCurrency: "USD",
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
} satisfies AdminOrderNotificationProps;
