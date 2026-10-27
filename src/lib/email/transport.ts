import "server-only";
import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | undefined;

function getTransport() {
  if (transporter) return transporter;

  const apiToken = process.env.MAILTRAP_API_TOKEN;
  if (!apiToken) throw new Error("MAILTRAP_API_TOKEN is not set");

  transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 20_000,
    greetingTimeout: 20_000,
    socketTimeout: 30_000,

    auth: {
      user: "api",
      pass: apiToken,
    },
  });

  return transporter;
}

export interface SendEmailParams {
  from: string;
  to: string | string[];
  replyTo?: string | string[];
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  await getTransport().sendMail(params);
}
