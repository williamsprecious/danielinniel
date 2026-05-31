/**
 * Shared shell for every transactional email — a light receipt layout:
 * white page, a centred 600px container with a #E5E5E5 hairline border, a
 * logo header, then template content composed of full-width sections divided
 * by edge-to-edge rules, closing with a soft-grey footer panel.
 *
 * Named export only (no default) so the preview server doesn't treat it as a
 * template. Outlook-safe: table-based Row/Column, inline styles, no float.
 */
import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "react-email";
import type { ReactNode } from "react";
import {
  brand,
  brandName,
  brandTagline,
  emailTailwindConfig,
  logoUrl,
  shopUrl,
  socials,
} from "../theme";

type EmailLayoutProps = {
  /** Inbox preview snippet — first thing shown in the client list. */
  preview: string;
  /**
   * Internal/admin-facing email (contact, inquiry, order notification). These
   * carry a "Reply to …" action, so the "please don't reply directly" footer
   * line is dropped to avoid contradicting it.
   */
  internal?: boolean;
  children: ReactNode;
};

export function EmailLayout({
  preview,
  internal = false,
  children,
}: EmailLayoutProps) {
  return (
    <Html lang="en">
      {/* No <link> font — the layout uses a system Helvetica/Arial stack
          (see theme fontFamily) that renders natively in every email client. */}
      <Head />
      <Tailwind config={emailTailwindConfig}>
        <Body
          className="bg-panel font-sans"
          style={{ margin: 0, padding: 0, backgroundColor: brand.panel }}
        >
          <Preview>{preview}</Preview>

          <Container
            className="my-[10px] mx-auto w-full max-w-[600px] bg-paper"
            style={{ border: `1px solid ${brand.line}` }}
          >
            {/* Logo header */}
            <Section className="bg-paper px-[40px] py-[28px] text-center">
              <Link href={shopUrl}>
                <Img
                  src={logoUrl}
                  alt={brandName}
                  width="300"
                  height="15"
                  className="mx-auto block"
                />
              </Link>
            </Section>

            <Hr className="m-0" style={{ borderColor: brand.line }} />

            {/* Template content — full-width sections, each divider-separated */}
            {children}

            <Hr className="m-0" style={{ borderColor: brand.line }} />

            {/* Footer panel — soft grey, like the Nike "Get Help" block */}
            <Section className="bg-panel px-[40px] pb-[28px] pt-[28px]">
              <Text
                className="m-0 text-center text-[13px] leading-[20px]"
                style={{ color: brand.meta }}
              >
                {brandTagline}
              </Text>

              <Row className="mt-[18px]" width="100%">
                {socials.map((s) => (
                  <Column key={s.label} align="center" className="w-[25%]">
                    <Link
                      href={s.href}
                      className="text-[12px] font-medium"
                      style={{ color: brand.heading, textDecoration: "none" }}
                    >
                      {s.label}
                    </Link>
                  </Column>
                ))}
              </Row>

              <Section className="mt-[22px] text-center">
                <Link
                  href={shopUrl}
                  className="text-[13px] font-bold"
                  style={{ color: brand.heading, textDecoration: "none" }}
                >
                  Visit the shop →
                </Link>
              </Section>
            </Section>

            <Hr className="m-0" style={{ borderColor: brand.line }} />

            {/* Legal fine print */}
            <Section className="bg-paper px-[40px] py-[24px]">
              <Text
                className="m-0 text-center text-[12px] leading-[18px]"
                style={{ color: brand.muted }}
              >
                © {new Date().getFullYear()} {brandName}.
                {internal
                  ? ""
                  : " This is an automated message — please don't reply directly."}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
