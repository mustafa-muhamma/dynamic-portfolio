import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { defineConfig } from "vitest/config";

process.env.NODE_ENV = "test";

export default defineConfig({
  plugins: [
    {
      name: "js-to-ts-resolver",
      enforce: "pre",
      resolveId(source: string, importer?: string) {
        if (!source.endsWith(".js") || !importer) return undefined;
        const candidate = resolve(dirname(importer), source.slice(0, -3) + ".ts");
        if (existsSync(candidate)) return candidate;
        return undefined;
      }
    }
  ],
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    testTimeout: 15000,
    hookTimeout: 30000
  }
});
