import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const prettierBin = resolve(root, "node_modules/prettier/bin/prettier.cjs");
const supported = /\.(ts|tsx|js|mjs|cjs|json|md|css)$/i;

const staged = spawnSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACMR"], {
  encoding: "utf8",
  cwd: root
});
if (staged.status !== 0) {
  process.exit(staged.status ?? 1);
}

const files = staged.stdout.split("\n").filter((file) => supported.test(file));
if (files.length === 0) {
  process.exit(0);
}

const format = spawnSync(process.execPath, [prettierBin, "--write", ...files], {
  stdio: "inherit",
  cwd: root
});
if (format.status !== 0) {
  process.exit(format.status ?? 1);
}

const reAdd = spawnSync("git", ["add", ...files], { cwd: root });
process.exit(reAdd.status ?? 0);
