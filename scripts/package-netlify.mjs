import { cp, mkdir, mkdtemp, lstat, readdir } from "node:fs/promises";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const artifacts = path.join(root, "artifacts");
await mkdir(artifacts, { recursive: true });
const output = await mkdtemp(path.join(artifacts, "pulse-netlify-"));
const files = [
  "netlify.toml",
  "package.json",
  "scripts",
  ".gitignore",
  "README.md",
  "SECURITY.md",
  "docs",
  "web/src",
  "web/database",
  "web/scripts",
  "web/tests",
  "web/package.json",
  "web/package-lock.json",
  "web/next.config.ts",
  "web/postcss.config.mjs",
  "web/eslint.config.mjs",
  "web/tsconfig.json",
  "web/tsconfig.backend.json",
  "web/tsconfig.test.json",
  "web/.env.example",
  "web/.gitignore",
];
async function copySafe(relative) {
  const source = path.join(root, relative),
    dest = path.join(output, relative);
  const info = await lstat(source);
  if (info.isSymbolicLink())
    throw new Error("Symlinks are excluded from deployment packages.");
  if (info.isDirectory()) {
    await mkdir(dest, { recursive: true });
    for (const item of await readdir(source)) {
      if (item.startsWith(".") || item === "node_modules") continue;
      await copySafe(path.join(relative, item));
    }
  } else {
    await mkdir(path.dirname(dest), { recursive: true });
    await cp(source, dest, { errorOnExist: true, force: false });
  }
}
for (const file of files) await copySafe(file);
console.log(`Netlify source package created: ${output}`);
console.log(
  "Build using Netlify's Next.js adapter. This is not a static drag-and-drop site. Private environment files, credentials, local databases and report files are excluded.",
);
