import nodemailer from "nodemailer";
import { siteMetadata } from "@/data/site";
import { getMailSettings } from "@/lib/admin-settings-repository";
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

type EffectiveMailConfig = {
  resend: {
    apiKey?: string;
    from?: string;
    to?: string;
  };
  smtp: {
    host?: string;
    user?: string;
    pass?: string;
    from?: string;
    to?: string;
    port?: number;
    secure?: boolean;
  };
};

async function getEffectiveMailConfig(): Promise<EffectiveMailConfig> {
  const dbSettings = await getMailSettings();

  const from = dbSettings?.mailFrom || process.env.MAIL_FROM;
  const to = dbSettings?.mailTo || process.env.MAIL_TO;

  return {
    resend: {
      apiKey: dbSettings?.provider === "resend"
        ? dbSettings.resendApiKey || process.env.RESEND_API_KEY
        : process.env.RESEND_API_KEY,
      from,
      to,
    },
    smtp: {
      from,
      host: dbSettings?.provider === "smtp"
        ? dbSettings.smtpHost || process.env.SMTP_HOST
        : process.env.SMTP_HOST,
      pass: dbSettings?.provider === "smtp"
        ? dbSettings.smtpPass || process.env.SMTP_PASS
        : process.env.SMTP_PASS,
      port: Number(
        dbSettings?.provider === "smtp"
          ? dbSettings.smtpPort || process.env.SMTP_PORT || "587"
          : process.env.SMTP_PORT || "587",
      ),
      secure: dbSettings?.provider === "smtp"
        ? (dbSettings.smtpSecure ?? (process.env.SMTP_SECURE === "true"))
        : (process.env.SMTP_SECURE === "true"),
      to,
      user: dbSettings?.provider === "smtp"
        ? dbSettings.smtpUser || process.env.SMTP_USER
        : process.env.SMTP_USER,
    },
  };
}

function getSmtpConfig(config: EffectiveMailConfig) {
  const host = config.smtp.host;
  const user = config.smtp.user;
  const pass = config.smtp.pass;
  const from = config.smtp.from;
  const to = config.smtp.to;
  const port = Number(config.smtp.port || 587);
  const secure = config.smtp.secure || port === 465;

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

function getResendConfig(config: EffectiveMailConfig) {
  const apiKey = config.resend.apiKey;
  const from = config.resend.from;
  const to = config.resend.to;

  if (!apiKey || !from || !to) {
    return null;
  }

  return {
    apiKey,
    from,
    to,
  };
}

export async function getMailSetupStatus(): Promise<MailSetupStatus> {
  const config = await getEffectiveMailConfig();
  const resendMissing: string[] = [];
  const smtpMissing: string[] = [];

  if (!config.resend.apiKey) {
    resendMissing.push("RESEND_API_KEY");
  }

  if (!config.resend.from) {
    resendMissing.push("MAIL_FROM");
  }

  if (!config.resend.to) {
    resendMissing.push("MAIL_TO");
  }

  if (!config.smtp.host) {
    smtpMissing.push("SMTP_HOST");
  }

  if (!config.smtp.port) {
    smtpMissing.push("SMTP_PORT");
  }

  if (!config.smtp.user) {
    smtpMissing.push("SMTP_USER");
  }

  if (!config.smtp.pass) {
    smtpMissing.push("SMTP_PASS");
  }

  if (!config.smtp.from) {
    smtpMissing.push("MAIL_FROM");
  }

  if (!config.smtp.to) {
    smtpMissing.push("MAIL_TO");
  }

  const resendConfigured = resendMissing.length === 0;
  const smtpConfigured = smtpMissing.length === 0;

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

async function sendViaResend(payload: ContactSubmissionInput, config: EffectiveMailConfig) {
  const resendConfig = getResendConfig(config);

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
  const config = await getEffectiveMailConfig();

  if (await sendViaResend(payload, config)) {
    return { status: "sent" };
  }

  const mailConfig = getSmtpConfig(config);

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