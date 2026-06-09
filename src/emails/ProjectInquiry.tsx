/**
 * Admin-facing email for a project-inquiry submission (sent to CONTACT_EMAIL).
 * Reply-To is set to the sender on the SES call.
 */
import { Text } from "react-email";
import { EmailLayout } from "./components/EmailLayout";
import {
  Block,
  Divider,
  Hero,
  InfoRow,
  Lead,
  OutlineButton,
  Panel,
  SectionTitle,
} from "./components/parts";
import { brand } from "./theme";
import { formatCategory, formatDesign, formatGrade } from "@/lib/utils";

type ProjectInquiryProps = {
  name: string;
  email: string;
  company?: string;
  category: string;
  grade?: string;
  design?: string;
  budget: string;
  projectDetails: string;
};

export default function ProjectInquiry({
  name,
  email,
  company,
  category,
  grade,
  design,
  budget,
  projectDetails,
}: ProjectInquiryProps) {
  return (
    <EmailLayout internal preview={`New project inquiry from ${name}`}>
      <Hero eyebrow="New project inquiry" title={name}>
        <Lead>{formatCategory(category)}</Lead>
      </Hero>

      <Divider />

      <Block>
        <SectionTitle>Contact</SectionTitle>
        <InfoRow label="Name" value={name} />
        <InfoRow label="Email" value={email} />
        {company ? <InfoRow label="Company" value={company} /> : null}
      </Block>

      <Divider />

      <Block>
        <SectionTitle>Project</SectionTitle>
        <InfoRow label="Category" value={formatCategory(category)} />
        {grade ? <InfoRow label="Grade" value={formatGrade(grade)} /> : null}
        {design ? <InfoRow label="Design" value={formatDesign(design)} /> : null}
        <InfoRow label="Budget" value={budget} />
      </Block>

      <Divider />

      <Panel>
        <SectionTitle>Details</SectionTitle>
        <Text
          className="m-0 text-[14px] font-medium leading-[24px]"
          style={{ whiteSpace: "pre-wrap", color: brand.heading }}
        >
          {projectDetails}
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

ProjectInquiry.PreviewProps = {
  name: "Ada Okafor",
  email: "ada@example.com",
  company: "Studio Nova",
  category: "cover-art",
  grade: "advanced",
  design: undefined,
  budget: "$1,500 – $3,000",
  projectDetails:
    "Looking for a striking cover for a sci-fi novella. Mood is moody and cinematic, with a lone figure against a vast landscape.\n\nNeed final art in ~4 weeks.",
} satisfies ProjectInquiryProps;
