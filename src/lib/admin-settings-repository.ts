import { getMongoDatabase } from "@/lib/mongodb";

export type MailProvider = "resend" | "smtp";

export type AdminConfigStatus = {
  configured: boolean;
  missing: string[];
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

export type MailSettings = {
  provider: MailProvider;
  resendApiKey?: string;
  smtpHost?: string;
  smtpPass?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  mailFrom?: string;
  mailTo?: string;
  updatedAt?: string;
};

type MailSettingsDocument = {
  _id: "mail";
  provider: MailProvider;
  resendApiKey?: string;
  smtpHost?: string;
  smtpPass?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  mailFrom?: string;
  mailTo?: string;
  updatedAt: Date;
};

async function getSettingsCollection() {
  const database = await getMongoDatabase();
  return database.collection<MailSettingsDocument>("settings");
}

export async function getMailSettings(): Promise<MailSettings | null> {
  try {
    const collection = await getSettingsCollection();
    const doc = await collection.findOne({ _id: "mail" });

    if (!doc) {
      return null;
    }

    return {
      mailFrom: doc.mailFrom,
      mailTo: doc.mailTo,
      provider: doc.provider,
      resendApiKey: doc.resendApiKey,
      smtpHost: doc.smtpHost,
      smtpPass: doc.smtpPass,
      smtpPort: doc.smtpPort,
      smtpSecure: doc.smtpSecure,
      smtpUser: doc.smtpUser,
      updatedAt: doc.updatedAt.toISOString(),
    };
  } catch {
    return null;
  }
}

export async function saveMailSettings(payload: MailSettings) {
  const collection = await getSettingsCollection();
  await collection.updateOne(
    { _id: "mail" },
    {
      $set: {
        mailFrom: payload.mailFrom,
        mailTo: payload.mailTo,
        provider: payload.provider,
        resendApiKey: payload.resendApiKey,
        smtpHost: payload.smtpHost,
        smtpPass: payload.smtpPass,
        smtpPort: payload.smtpPort,
        smtpSecure: payload.smtpSecure,
        smtpUser: payload.smtpUser,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );
}
