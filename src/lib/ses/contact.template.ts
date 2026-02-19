import { contactSchema, projectSchema } from "@/schema";
import {
  escapeHtml,
  formatCategory,
  formatDesign,
  formatGrade,
} from "@/lib/utils";
import { z } from "zod";

type ProjectFormData = z.infer<typeof projectSchema>;
type ContactFormData = z.infer<typeof contactSchema>;

export const getProjectEmailTemplate = (data: ProjectFormData): string => {
  const category = formatCategory(data.category);
  const grade = data.grade ? formatGrade(data.grade) : null;
  const design = data.design ? formatDesign(data.design) : null;

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>New Project Inquiry - Danielinniel</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .email-content {
        padding: 20px !important;
      }
      .data-row {
        display: block !important;
        width: 100% !important;
      }
      .data-label, .data-value {
        display: block !important;
        width: 100% !important;
        padding: 8px 0 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px; width: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #6B7FD7 0%, #8B6FD7 50%, #5A6BC8 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">New Project Inquiry</h1>
            </td>
          </tr>
          <tr>
            <td class="email-content" style="padding: 40px 30px;">
              <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6; font-family: Arial, Helvetica, sans-serif;">
                You have received a new project inquiry from your website.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #6B7FD7;">
                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Contact Information</h2>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr class="data-row">
                        <td class="data-label" width="140" style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; vertical-align: top;">Name:</td>
                        <td class="data-value" style="padding: 8px 0; color: #333333; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">${escapeHtml(data.name)}</td>
                      </tr>
                      <tr class="data-row">
                        <td class="data-label" width="140" style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; vertical-align: top;">Email:</td>
                        <td class="data-value" style="padding: 8px 0; color: #333333; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">
                          <a href="mailto:${escapeHtml(data.email)}" style="color: #6B7FD7; text-decoration: none;">${escapeHtml(data.email)}</a>
                        </td>
                      </tr>
                      ${
                        data.company
                          ? `
                      <tr class="data-row">
                        <td class="data-label" width="140" style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; vertical-align: top;">Company:</td>
                        <td class="data-value" style="padding: 8px 0; color: #333333; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">${escapeHtml(data.company)}</td>
                      </tr>
                      `
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #8B6FD7;">
                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Project Details</h2>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr class="data-row">
                        <td class="data-label" width="140" style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; vertical-align: top;">Category:</td>
                        <td class="data-value" style="padding: 8px 0; color: #333333; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">${escapeHtml(category)}</td>
                      </tr>
                      ${
                        grade
                          ? `
                      <tr class="data-row">
                        <td class="data-label" width="140" style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; vertical-align: top;">Grade:</td>
                        <td class="data-value" style="padding: 8px 0; color: #333333; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">${escapeHtml(grade)}</td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        design
                          ? `
                      <tr class="data-row">
                        <td class="data-label" width="140" style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; vertical-align: top;">Design Type:</td>
                        <td class="data-value" style="padding: 8px 0; color: #333333; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">${escapeHtml(design)}</td>
                      </tr>
                      `
                          : ""
                      }
                      <tr class="data-row">
                        <td class="data-label" width="140" style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; vertical-align: top;">Budget:</td>
                        <td class="data-value" style="padding: 8px 0; color: #6B7FD7; font-size: 14px; font-family: Arial, Helvetica, sans-serif; font-weight: bold;">${escapeHtml(data.budget)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #6B7FD7;">
                    <h2 style="margin: 0 0 15px 0; color: #333333; font-size: 20px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Project Description</h2>
                    <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.8; font-family: Arial, Helvetica, sans-serif; white-space: pre-wrap;">${escapeHtml(data.projectDetails)}</p>
                  </td>
                </tr>
              </table>
              <p style="margin: 30px 0 0 0; color: #999999; font-size: 12px; line-height: 1.6; font-family: Arial, Helvetica, sans-serif; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px;">
                This email was sent from your website contact form.<br>
                Please respond to the client at <a href="mailto:${escapeHtml(data.email)}" style="color: #6B7FD7; text-decoration: none;">${escapeHtml(data.email)}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

export const getContactEmailTemplate = (data: ContactFormData): string => {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>New Contact Message - Danielinniel</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .email-content {
        padding: 20px !important;
      }
      .data-row {
        display: block !important;
        width: 100% !important;
      }
      .data-label, .data-value {
        display: block !important;
        width: 100% !important;
        padding: 8px 0 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px; width: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #6B7FD7 0%, #8B6FD7 50%, #5A6BC8 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">New Contact Message</h1>
            </td>
          </tr>
          <tr>
            <td class="email-content" style="padding: 40px 30px;">
              <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6; font-family: Arial, Helvetica, sans-serif;">
                You have received a new message from your website contact form.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #6B7FD7;">
                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Contact Information</h2>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr class="data-row">
                        <td class="data-label" width="140" style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; vertical-align: top;">Name:</td>
                        <td class="data-value" style="padding: 8px 0; color: #333333; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">${escapeHtml(data.name)}</td>
                      </tr>
                      <tr class="data-row">
                        <td class="data-label" width="140" style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; vertical-align: top;">Email:</td>
                        <td class="data-value" style="padding: 8px 0; color: #333333; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">
                          <a href="mailto:${escapeHtml(data.email)}" style="color: #6B7FD7; text-decoration: none;">${escapeHtml(data.email)}</a>
                        </td>
                      </tr>
                      ${
                        data.company
                          ? `
                      <tr class="data-row">
                        <td class="data-label" width="140" style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; vertical-align: top;">Company:</td>
                        <td class="data-value" style="padding: 8px 0; color: #333333; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">${escapeHtml(data.company)}</td>
                      </tr>
                      `
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #8B6FD7;">
                    <h2 style="margin: 0 0 15px 0; color: #333333; font-size: 20px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">Message</h2>
                    <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.8; font-family: Arial, Helvetica, sans-serif; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
                  </td>
                </tr>
              </table>
              <p style="margin: 30px 0 0 0; color: #999999; font-size: 12px; line-height: 1.6; font-family: Arial, Helvetica, sans-serif; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px;">
                This email was sent from your website contact form.<br>
                Please respond to the client at <a href="mailto:${escapeHtml(data.email)}" style="color: #6B7FD7; text-decoration: none;">${escapeHtml(data.email)}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

export function generatePlainTextProjectEmail(data: ProjectFormData): string {
  const category =
    data.category === "cover-art" ? "Cover Art" : "Concept & Design";
  const grade = data.grade
    ? `Grade: ${data.grade === "essential" ? "Essential" : "Advanced"}\n`
    : "";
  const design = data.design ? `Design Type: ${data.design}\n` : "";
  const company = data.company ? `Company: ${data.company}\n` : "";

  return `
New Project Inquiry

Contact Information:
Name: ${data.name}
Email: ${data.email}
${company}Project Details:
Category: ${category}
${grade}${design}Budget: ${data.budget}

Project Description:
${data.projectDetails}

---
This email was sent from your website contact form.
Please respond to the client at ${data.email}
  `.trim();
}

export function generatePlainTextContactEmail(data: ContactFormData): string {
  const company = data.company ? `Company: ${data.company}\n` : "";

  return `
New Contact Message

Contact Information:
Name: ${data.name}
Email: ${data.email}
${company}Message:
${data.message}

---
This email was sent from your website contact form.
Please respond to the client at ${data.email}
  `.trim();
}
