import net from "node:net";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const distDir = path.join(siteRoot, "dist");

async function hasCommand(command) {
  try {
    const { stdout } = await execFileAsync("sh", ["-lc", `command -v ${command}`]);
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

async function tryBindPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", (error) => {
      resolve({ ok: false, message: String(error.message || error) });
    });

    server.once("listening", () => {
      server.close(() => resolve({ ok: true, message: `127.0.0.1:${port}` }));
    });

    server.listen(port, "127.0.0.1");
  });
}

function statusLine(label, ok, detail) {
  return `${ok ? "OK" : "FAIL"}  ${label}${detail ? ` :: ${detail}` : ""}`;
}

async function main() {
  const checks = [];

  checks.push({
    label: "dist 目录存在",
    ok: fs.existsSync(distDir),
    detail: distDir
  });

  for (const command of ["node", "npm", "python3", "open"]) {
    const found = await hasCommand(command);
    checks.push({
      label: `${command} 可用`,
      ok: Boolean(found),
      detail: found || "未找到"
    });
  }

  const bindResult = await tryBindPort(4321);
  checks.push({
    label: "本地端口 4321 可绑定",
    ok: bindResult.ok,
    detail: bindResult.message
  });

  const summary = checks.map((item) => statusLine(item.label, item.ok, item.detail)).join("\n");

  console.log("唐山海钓指南预览环境诊断");
  console.log(summary);

  const failed = checks.filter((item) => !item.ok);
  if (failed.length) {
    console.log("\n结论：当前环境不适合直接做真实浏览器预览，请优先在宿主机运行 preview-local.command。");
    process.exitCode = 1;
    return;
  }

  console.log("\n结论：当前环境具备本地预览基础条件。");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
