import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "client", "src"),
      "@shared": path.resolve(templateRoot, "shared"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    include: [
      "server/**/*.test.ts",
      "server/**/*.spec.ts",
      "client/**/*.test.ts",
      "client/**/*.spec.ts",
    ],
    // Skip tests requiring DB if DATABASE_URL not set
    exclude: process.env.DATABASE_URL ? [] : [
      "server/archive.test.ts",
      "server/auth.logout.test.ts",
      "server/payments.test.ts",
      "server/stamps.test.ts",
      "server/stripe-webhook.test.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "lcov", "html"],
      reportsDirectory: "./coverage",
      exclude: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/*.test.ts", "**/*.spec.ts"],
      all: true,
    },
  },
});
