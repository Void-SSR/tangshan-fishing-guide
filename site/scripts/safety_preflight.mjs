import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(siteRoot, "..");

const scanTargets = [
  path.join(siteRoot, "package.json"),
  path.join(siteRoot, "preview-local.command"),
  path.join(siteRoot, "scripts", "preview_local.py"),
  path.join(projectRoot, "docs", "workflow", "preview-and-qa-runtime-v1.md")
];

const forbiddenRules = [
  { pattern: /--no-sandbox/g, reason: "禁止绕过浏览器沙箱" },
  { pattern: /--disable-setuid-sandbox/g, reason: "禁止关闭浏览器 setuid 沙箱" },
  { pattern: /\bsudo\b/g, reason: "禁止把本地预览或验收建立在 sudo 权限上" },
  { pattern: /curl\s+[^|\n]+?\|\s*(sh|bash)/g, reason: "禁止使用未审查的管道脚本直执行" },
  { pattern: /chmod\s+-R\s+777/g, reason: "禁止粗暴放宽本地文件权限" },
  { pattern: /rm\s+-rf\s+\//g, reason: "禁止破坏性系统级删除命令" }
];

async function main() {
  const findings = [];

  for (const target of scanTargets) {
    let text = "";
    try {
      text = await fs.readFile(target, "utf8");
    } catch {
      continue;
    }

    for (const rule of forbiddenRules) {
      if (rule.pattern.test(text)) {
        findings.push(`${target}: ${rule.reason}`);
      }
    }
  }

  if (findings.length) {
    console.error("Local safety preflight failed.");
    findings.forEach((item) => console.error(`- ${item}`));
    process.exitCode = 1;
    return;
  }

  console.log("Local safety preflight passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
