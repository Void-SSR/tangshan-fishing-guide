import playwrightTest from "../../../node_modules/@playwright/test/index.js";

const { defineConfig } = playwrightTest;

export default defineConfig({
  testDir: "./",
  testMatch: /smoke\.spec\.mjs/,
  use: {
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 390, height: 844 }
  },
  webServer: {
    command: "python3 -m http.server 4173 -d dist",
    cwd: "..",
    port: 4173,
    reuseExistingServer: true,
    timeout: 20000
  }
});
