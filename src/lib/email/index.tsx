/**
 * Mailer layer: renders React Email templates to HTML + plain text and sends
 * them through the existing AWS SES client. Lives OUTSIDE `src/emails` so the
 * preview server (`--dir src/emails`) never scans these send helpers.
 */
import "server-only";
import type { ReactElement } from "react";
import { render } from "react-email";
import { sendEmail } from "@/lib/ses";
import { formatNGN, type DownloadItem, type EmailOrder } from "@/emails/types";
import OrderConfirmation from "@/emails/OrderConfirmation";
import DigitalDelivery from "@/emails/DigitalDelivery";
import AdminOrderNotification from "@/emails/AdminOrderNotification";
import ContactMessage from "@/emails/ContactMessage";
import ProjectInquiry from "@/emails/ProjectInquiry";

const FROM = "Danielinniel <no-reply@danielinniel.com>";

const adminInbox = (): string => {
  const to = process.env.CONTACT_EMAIL;
  if (!to) throw new Error("CONTACT_EMAIL is not set");
  return to;
};

/** Render a template to both HTML and plain-text bodies. */
async function renderEmail(
  node: ReactElement,
): Promise<{ html: string; text: string }> {
  const [html, text] = await Promise.all([
    render(node),
    render(node, { plainText: true }),
  ]);
  return { html, text };
}

/** Customer order confirmation. Pass `downloads` for digital-only orders. */
export async function sendOrderConfirmationEmail({
  order,
  downloads,
}: {
  order: EmailOrder;
  downloads?: DownloadItem[];
}): Promise<void> {
  const { html, text } = await renderEmail(
    <OrderConfirmation order={order} downloads={downloads} />,
  );
  await sendEmail({
    from: FROM,
    to: order.customer.email,
    replyTo: adminInbox(),
    subject: `Your order ${order.orderNumber} is confirmed`,
    html,
    text,
  });
}

/** Standalone digital-delivery email for mixed (physical + digital) carts. */
export async function sendDigitalDeliveryEmail({
  order,
  downloads,
}: {
  order: EmailOrder;
  downloads: DownloadItem[];
}): Promise<void> {
  const { html, text } = await renderEmail(
    <DigitalDelivery
      firstName={order.customer.firstName}
      orderNumber={order.orderNumber}
      downloads={downloads}
    />,
  );
  await sendEmail({
    from: FROM,
    to: order.customer.email,
    replyTo: adminInbox(),
    subject: `Your downloads for order ${order.orderNumber}`,
    html,
    text,
  });
}

/** Internal new-order notification to the store inbox. */
export async function sendAdminOrderEmail({
  order,
}: {
  order: EmailOrder;
}): Promise<void> {
  const { html, text } = await renderEmail(
    <AdminOrderNotification order={order} />,
  );
  await sendEmail({
    from: FROM,
    to: adminInbox(),
    replyTo: order.customer.email,
    subject: `New order ${order.orderNumber} — ${formatNGN(order.totalNGN)}`,
    html,
    text,
  });
}

/** Contact-form submission → store inbox. */
export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
}): Promise<void> {
  const { html, text } = await renderEmail(<ContactMessage {...data} />);
  await sendEmail({
    from: FROM,
    to: adminInbox(),
    replyTo: data.email,
    subject: `New Contact Message from ${data.name}`,
    html,
    text,
  });
}

/** Project-inquiry submission → store inbox. */
export async function sendProjectInquiryEmail(data: {
  name: string;
  email: string;
  company?: string;
  category: string;
  grade?: string;
  design?: string;
  budget: string;
  projectDetails: string;
}): Promise<void> {
  const { html, text } = await renderEmail(<ProjectInquiry {...data} />);
  await sendEmail({
    from: FROM,
    to: adminInbox(),
    replyTo: data.email,
    subject: `New Project Inquiry from ${data.name} - ${
      data.category === "cover-art" ? "Cover Art" : "Concept & Design"
    }`,
    html,
    text,
  });
}
