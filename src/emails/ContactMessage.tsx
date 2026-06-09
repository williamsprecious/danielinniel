/**
 * Admin-facing email for a contact-form submission (sent to CONTACT_EMAIL).
 * Reply-To is set to the sender on the SES call, so "Reply" reaches them.
 */
import { Text } from "react-email";
import { EmailLayout } from "./components/EmailLayout";
import {
  Block,
  Divider,
  Hero,
  InfoRow,
  OutlineButton,
  Panel,
  SectionTitle,
} from "./components/parts";
import { brand } from "./theme";

type ContactMessageProps = {
  name: string;
  email: string;
  company?: string;
  message: string;
};

export default function ContactMessage({
  name,
  email,
  company,
  message,
}: ContactMessageProps) {
  return (
    <EmailLayout internal preview={`New contact message from ${name}`}>
      <Hero eyebrow="New contact message" title={name} />

      <Divider />

      <Block>
        <SectionTitle>From</SectionTitle>
        <InfoRow label="Name" value={name} />
        <InfoRow label="Email" value={email} />
        {company ? <InfoRow label="Company" value={company} /> : null}
      </Block>

      <Divider />

      <Panel>
        <SectionTitle>Message</SectionTitle>
        <Text
          className="m-0 text-[14px] font-medium leading-[24px]"
          style={{ whiteSpace: "pre-wrap", color: brand.heading }}
        >
          {message}
        </Text>
      </Panel>

      <Divider />

      <Block>
        <OutlineButton href={`mailto:${email}`}>
          Reply to {name.split(" ")[0]}
        </OutlineButton>
      </Block>
    </EmailLayout>
  );
}

ContactMessage.PreviewProps = {
  name: "Ada Okafor",
  email: "ada@example.com",
  company: "Studio Nova",
  message:
    "Hi! I love your concept work and would like to talk about a cover commission for an upcoming graphic novel.\n\nIs that something you take on? Rough budget is flexible.",
} satisfies ContactMessageProps;
