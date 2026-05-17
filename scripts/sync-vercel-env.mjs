import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const vercelBinary =
  process.env.VERCEL_BIN ||
  (process.platform === "win32"
    ? "C:\\Users\\Admin\\AppData\\Roaming\\npm\\vercel.cmd"
    : "vercel");

function getArgValue(flag) {
  const match = args.find((argument) => argument.startsWith(`${flag}=`));

  if (match) {
    return match.slice(flag.length + 1);
  }

  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

function hasFlag(flag) {
  return args.includes(flag) || args.some((argument) => argument.startsWith(`${flag}=`));
}

function parseEnvFile(filePath) {
  return readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const separatorIndex = line.indexOf("=");

      if (separatorIndex < 0) {
        return null;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1);
      return { key, value };
    })
    .filter(Boolean);
}

function runVercel(argumentsList) {
  const result = spawnSync(vercelBinary, argumentsList, { shell: true, {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  if (result.error) {
    throw result.error;
  }

  return result;
}

function ensureLinked(projectName, teamId) {
  const linkedProjectFile = resolve(process.cwd(), ".vercel", "project.json");

  if (existsSync(linkedProjectFile)) {
    return;
  }

  if (!projectName || !teamId) {
    throw new Error(
      "Workspace chưa được link với Vercel. Hãy truyền --project và --team cho lần chạy đầu tiên.",
    );
  }

  const linkResult = runVercel([
    "link",
    "--yes",
    "--project",
    projectName,
    "--team",
    teamId,
  ]);

  if (linkResult.status !== 0) {
    throw new Error(linkResult.stderr || linkResult.stdout || "Không thể link project Vercel.");
  }
}

function shouldSyncKey(key) {
  return /^(MONGODB_|ADMIN_|SMTP_|MAIL_|RESEND_|NEXT_PUBLIC_SITE_URL$)/.test(key);
}

function upsertEnvVariable(key, value, environment) {
  const updateResult = runVercel([
    "env",
    "update",
    key,
    environment,
    "--value",
    value,
    "-y",
  ]);

  if (updateResult.status === 0) {
    return "updated";
  }

  const combinedOutput = `${updateResult.stdout}\n${updateResult.stderr}`;

  if (/not found|does not exist|not exist|could not find/i.test(combinedOutput)) {
    const addResult = runVercel([
      "env",
      "add",
      key,
      environment,
      "--value",
      value,
      "--yes",
    ]);

    if (addResult.status === 0) {
      return "added";
    }

    throw new Error(
      `Không thể thêm biến ${key} cho môi trường ${environment}: ${addResult.stderr || addResult.stdout}`,
    );
  }

  throw new Error(
    `Không thể cập nhật biến ${key} cho môi trường ${environment}: ${updateResult.stderr || updateResult.stdout}`,
  );
}

const envFile = resolve(process.cwd(), getArgValue("--env-file") || ".env.local");
const projectName = getArgValue("--project");
const teamId = getArgValue("--team");
const allowLocalhostSiteUrl = hasFlag("--allow-localhost-site-url");
const environmentTargets = (getArgValue("--environments") || "development,preview,production")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

if (!existsSync(envFile)) {
  throw new Error(`Không tìm thấy file môi trường: ${envFile}`);
}

ensureLinked(projectName, teamId);

const envEntries = parseEnvFile(envFile).filter(({ key }) => shouldSyncKey(key));
const syncEntries = envEntries.filter(({ key, value }) => {
  if (
    key === "NEXT_PUBLIC_SITE_URL" &&
    /localhost|127\.0\.0\.1/i.test(value) &&
    !allowLocalhostSiteUrl
  ) {
    console.log(
      "Bo qua NEXT_PUBLIC_SITE_URL vi dang tro ve localhost. Dung --allow-localhost-site-url neu ban muon day gia tri nay len Vercel.",
    );
    return false;
  }

  return true;
});

if (syncEntries.length === 0) {
  console.log("Khong co bien moi truong phu hop de dong bo.");
  process.exit(0);
}

for (const environment of environmentTargets) {
  console.log(`Dong bo moi truong: ${environment}`);

  for (const { key, value } of syncEntries) {
    const action = upsertEnvVariable(key, value, environment);
    console.log(`- ${key}: ${action}`);
  }
}

console.log("Hoan tat dong bo bien moi truong len Vercel.");
