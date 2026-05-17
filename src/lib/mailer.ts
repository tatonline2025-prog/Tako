import nodemailer from "nodemailer";
import { siteMetadata } from "@/data/site";
import type { ContactSubmissionInput } from "@/lib/contact-schema";

type MailDispatchResult = {
  status: "sent" | "skipped";
};

type ProviderStatus = {
  configured: boolean;
  missing: string[];
};

export type MailSetupStatus = {
  activeProvider: "resend" | "smtp" | null;
  resend: ProviderStatus;
  smtp: ProviderStatus;
};

function getSmtpConfig() {
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

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const to = process.env.MAIL_TO;

  if (!apiKey || !from || !to) {
    return null;
  }

  return {
    apiKey,
    from,
    to,
  };
}

export function getMailSetupStatus(): MailSetupStatus {
  const resendMissing: string[] = [];
  const smtpMissing: string[] = [];

  if (!process.env.RESEND_API_KEY) {
    resendMissing.push("RESEND_API_KEY");
  }

  if (!process.env.MAIL_FROM) {
    resendMissing.push("MAIL_FROM");
  }

  if (!process.env.MAIL_TO) {
    resendMissing.push("MAIL_TO");
  }

  if (!process.env.SMTP_HOST) {
    smtpMissing.push("SMTP_HOST");
  }

  if (!process.env.SMTP_PORT) {
    smtpMissing.push("SMTP_PORT");
  }

  if (!process.env.SMTP_USER) {
    smtpMissing.push("SMTP_USER");
  }

  if (!process.env.SMTP_PASS) {
    smtpMissing.push("SMTP_PASS");
  }

  if (!process.env.MAIL_FROM) {
    smtpMissing.push("MAIL_FROM");
  }

  if (!process.env.MAIL_TO) {
    smtpMissing.push("MAIL_TO");
  }

  const resendConfigured = resendMissing.length === 0;
  const smtpConfigured =
    smtpMissing.length === 0 && !Number.isNaN(Number(process.env.SMTP_PORT));

  return {
    activeProvider: resendConfigured ? "resend" : smtpConfigured ? "smtp" : null,
    resend: {
      configured: resendConfigured,
      missing: resendMissing,
    },
    smtp: {
      configured: smtpConfigured,
      missing: smtpMissing,
    },
  };
}

async function sendViaResend(payload: ContactSubmissionInput) {
  const resendConfig = getResendConfig();

  if (!resendConfig) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendConfig.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendConfig.from,
      html: `
        <h2>Yêu cầu liên hệ mới từ website TAKO Vietnam</h2>
        <p><strong>Họ tên:</strong> ${payload.fullName}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Số điện thoại:</strong> ${payload.phone}</p>
        <p><strong>Công ty:</strong> ${payload.company}</p>
        <p><strong>Quan tâm:</strong> ${payload.interest}</p>
        <p><strong>Nội dung:</strong></p>
        <p>${payload.message.replace(/\n/g, "<br />")}</p>
      `,
      reply_to: payload.email,
      subject: `[${siteMetadata.companyName}] Yêu cầu liên hệ từ ${payload.company}`,
      text: [
        `Họ tên: ${payload.fullName}`,
        `Email: ${payload.email}`,
        `Số điện thoại: ${payload.phone}`,
        `Công ty: ${payload.company}`,
        `Quan tâm: ${payload.interest}`,
        "Nội dung:",
        payload.message,
      ].join("\n"),
      to: resendConfig.to,
    }),
  });

  if (!response.ok) {
    throw new Error("Resend delivery failed.");
  }

  return true;
}

export async function sendContactNotification(
  payload: ContactSubmissionInput,
): Promise<MailDispatchResult> {
  if (await sendViaResend(payload)) {
    return { status: "sent" };
  }

  const mailConfig = getSmtpConfig();

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
      <h2>Yêu cầu liên hệ mới từ website TAKO Vietnam</h2>
      <p><strong>Họ tên:</strong> ${payload.fullName}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Số điện thoại:</strong> ${payload.phone}</p>
      <p><strong>Công ty:</strong> ${payload.company}</p>
      <p><strong>Quan tâm:</strong> ${payload.interest}</p>
      <p><strong>Nội dung:</strong></p>
      <p>${payload.message.replace(/\n/g, "<br />")}</p>
    `,
    replyTo: payload.email,
    subject: `[${siteMetadata.companyName}] Yêu cầu liên hệ từ ${payload.company}`,
    text: [
      `Họ tên: ${payload.fullName}`,
      `Email: ${payload.email}`,
      `Số điện thoại: ${payload.phone}`,
      `Công ty: ${payload.company}`,
      `Quan tâm: ${payload.interest}`,
      "Nội dung:",
      payload.message,
    ].join("\n"),
    to: mailConfig.to,
  });

  return { status: "sent" };
}