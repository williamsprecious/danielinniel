/**
 * Shared building blocks in the light-receipt pattern: full-width white /
 * grey sections, edge-to-edge dividers, a centred hero, bold black section
 * titles, label/value rows, outline buttons, address + download lists.
 *
 * Named exports only. Everything is Outlook-safe: Row/Column tables, inline
 * styles, no float, fixed-width buttons via inline-block.
 */
import { Column, Heading, Hr, Link, Row, Section, Text } from "react-email";
import type { DownloadItem, EmailAddress } from "../types";
import { brand } from "../theme";

/* ------------------------------------------------------------------ layout */

/** Edge-to-edge hairline divider between sections. */
export function Divider() {
  return <Hr className="m-0" style={{ borderColor: brand.line }} />;
}

/** Standard white content section with receipt padding. */
export function Block({ children }: { children: React.ReactNode }) {
  return <Section className="bg-paper px-[40px] py-[24px]">{children}</Section>;
}

/** Soft-grey emphasis section (totals, callouts). */
export function Panel({ children }: { children: React.ReactNode }) {
  return <Section className="bg-panel px-[40px] py-[24px]">{children}</Section>;
}

/* -------------------------------------------------------------- typography */

/** Small uppercase eyebrow above the hero headline. */
export function Eyebrow({ children }: { children: string }) {
  return (
    <Text
      className="m-0 text-[11px] font-bold uppercase"
      style={{ letterSpacing: "2px", color: brand.muted }}
    >
      {children}
    </Text>
  );
}

/** Hero headline — 32px bold, tight tracking (reference receipt style). */
export function Headline({ children }: { children: React.ReactNode }) {
  return (
    <Heading
      as="h1"
      className="m-0 mt-[10px] text-[32px] font-bold leading-[40px]"
      style={{ letterSpacing: "-1px", color: brand.heading }}
    >
      {children}
    </Heading>
  );
}

/** Lead / body paragraph (grey, centred inside the hero). */
export function Lead({ children }: { children: React.ReactNode }) {
  return (
    <Text
      className="m-0 mt-[14px] text-[14px] font-medium leading-[24px]"
      style={{ color: brand.body }}
    >
      {children}
    </Text>
  );
}

/** Centred hero block: eyebrow + headline + optional lead paragraphs. */
export function Hero({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Section className="bg-paper px-[40px] py-[40px] text-center">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Headline>{title}</Headline>
      {children}
    </Section>
  );
}

/** Bold black section title used to label a block (left-aligned). */
export function SectionTitle({ children }: { children: string }) {
  return (
    <Text
      className="m-0 mb-[14px] text-[15px] font-bold leading-[20px]"
      style={{ color: brand.heading }}
    >
      {children}
    </Text>
  );
}

/* -------------------------------------------------------------- data rows */

/** Labelled key/value row (bold black label, grey value below). */
export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Section className="mb-[14px]">
      <Text
        className="m-0 text-[13px] font-bold leading-[18px]"
        style={{ color: brand.heading }}
      >
        {label}
      </Text>
      <Text
        className="m-0 mt-[3px] text-[14px] font-medium leading-[20px]"
        style={{ color: brand.meta }}
      >
        {value}
      </Text>
    </Section>
  );
}

/** Two key/value pairs side by side (Nike "Order Number / Order Date"). */
export function MetaPair({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
}) {
  return (
    <Row width="100%">
      <Column className="w-[50%]" valign="top">
        <Text
          className="m-0 text-[13px] font-bold leading-[18px]"
          style={{ color: brand.heading }}
        >
          {leftLabel}
        </Text>
        <Text
          className="m-0 mt-[3px] text-[14px] font-medium leading-[20px]"
          style={{ color: brand.meta }}
        >
          {leftValue}
        </Text>
      </Column>
      <Column className="w-[50%]" valign="top">
        <Text
          className="m-0 text-[13px] font-bold leading-[18px]"
          style={{ color: brand.heading }}
        >
          {rightLabel}
        </Text>
        <Text
          className="m-0 mt-[3px] text-[14px] font-medium leading-[20px]"
          style={{ color: brand.meta }}
        >
          {rightValue}
        </Text>
      </Column>
    </Row>
  );
}

/* ----------------------------------------------------------------- button */

/** Outline button — bordered link, fixed min-width, centred (Nike style). */
export function OutlineButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Row>
      <Column align="center">
        <Link
          href={href}
          className="inline-block text-center text-[14px] font-medium"
          style={{
            border: `1px solid ${brand.btn}`,
            color: brand.heading,
            textDecoration: "none",
            paddingTop: "12px",
            paddingBottom: "12px",
            paddingLeft: "28px",
            paddingRight: "28px",
            minWidth: "200px",
          }}
        >
          {children}
        </Link>
      </Column>
    </Row>
  );
}

/* ------------------------------------------------------------- composites */

/** Formatted postal address — "Shipping to: Name" + lines (no card). */
export function AddressBlock({ address }: { address: EmailAddress }) {
  const region = [address.city, address.state, address.postalCode]
    .filter(Boolean)
    .join(", ");
  return (
    <Block>
      <Text
        className="m-0 text-[15px] font-bold leading-[22px]"
        style={{ color: brand.heading }}
      >
        Shipping to: {address.firstName} {address.lastName}
      </Text>
      <Text
        className="m-0 mt-[6px] text-[14px] font-medium leading-[22px]"
        style={{ color: brand.body }}
      >
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ""}
        {region ? ` · ${region}` : ""}
      </Text>
      <Text
        className="m-0 text-[14px] font-medium leading-[22px]"
        style={{ color: brand.body }}
      >
        {address.country} · {address.phone}
      </Text>
    </Block>
  );
}

/** List of digital files — each a title with a "Download" outline action. */
export function DownloadList({ downloads }: { downloads: DownloadItem[] }) {
  return (
    <Block>
      <SectionTitle>Your downloads</SectionTitle>
      {downloads.map((file, i) => (
        <Section key={i}>
          {i > 0 ? (
            <Hr className="my-[16px]" style={{ borderColor: brand.line }} />
          ) : null}
          <Row width="100%">
            <Column valign="middle" className="w-full">
              <Text
                className="m-0 text-[14px] font-medium leading-[20px]"
                style={{ color: brand.heading }}
              >
                {file.title}
              </Text>
            </Column>
            <Column align="right" valign="middle" className="w-[140px]">
              <Link
                href={file.url}
                className="inline-block text-center text-[13px] font-medium"
                style={{
                  border: `1px solid ${brand.btn}`,
                  color: brand.heading,
                  textDecoration: "none",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                }}
              >
                Download
              </Link>
            </Column>
          </Row>
        </Section>
      ))}
      <Text
        className="m-0 mt-[18px] text-[12px] font-medium leading-[18px]"
        style={{ color: brand.muted }}
      >
        Unable to download or access the files? Feel free to contact us and it
        will be resolved.
      </Text>
    </Block>
  );
}
