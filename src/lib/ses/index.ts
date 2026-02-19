import { SESClient } from "@aws-sdk/client-ses";
import { SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export interface SendEmailParams {
  from: string;
  to: string | string[];
  replyTo?: string | string[];
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({
  from,
  to,
  replyTo,
  subject,
  html,
  text,
}: SendEmailParams): Promise<void> {
  const params: SendEmailCommandInput = {
    Source: from,
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: html,
          Charset: "UTF-8",
        },
        Text: {
          Data: text,
          Charset: "UTF-8",
        },
      },
    },
    ...(replyTo && {
      ReplyToAddresses: Array.isArray(replyTo) ? replyTo : [replyTo],
    }),
  };

  const command = new SendEmailCommand(params);
  await sesClient.send(command);
}

export default sesClient;
