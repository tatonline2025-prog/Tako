import nodemailer from "nodemailer";
import { siteMetadata } from "@/data/site";
import type { ContactSubmissionInput } from "@/lib/contact-schema";

type MailDispatchResult = {
  status: "sent" | "skipped";
};

function getMailConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM;
  const to = process.env.MAIL_TO;
  const port = Number(process.env.SMTP_PORT || "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass || !from || !to || Number.isNaN(port)) {
    return null;
  }

  return {
    auth: {
      pass,
      user,
    },
    from,
    host,
    port,
    secure,
    to,
  };
}

export async function sendContactNotification(
  payload: ContactSubmissionInput,
): Promise<MailDispatchResult> {
  const mailConfig = getMailConfig();

  if (!mailConfig) {
    return { status: "skipped" };
  }

  const transporter = nodemailer.createTransport({
    auth: mailConfig.auth,
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
  });

  await transporter.sendMail({
    from: mailConfig.from,
    html: `
      <h2>Yeu cau lien he moi tu website TAKO Vietnam</h2>
      <p><strong>Ho ten:</strong> ${payload.fullName}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>So dien thoai:</strong> ${payload.phone}</p>
      <p><strong>Cong ty:</strong> ${payload.company}</p>
      <p><strong>Quan tam:</strong> ${payload.interest}</p>
      <p><strong>Noi dung:</strong></p>
      <p>${payload.message.replace(/\n/g, "<br />")}</p>
    `,
    replyTo: payload.email,
    subject: `[${siteMetadata.companyName}] Yeu cau lien he tu ${payload.company}`,
    text: [
      `Ho ten: ${payload.fullName}`,
      `Email: ${payload.email}`,
      `So dien thoai: ${payload.phone}`,
      `Cong ty: ${payload.company}`,
      `Quan tam: ${payload.interest}`,
      "Noi dung:",
      payload.message,
    ].join("\n"),
    to: mailConfig.to,
  });

  return { status: "sent" };
}