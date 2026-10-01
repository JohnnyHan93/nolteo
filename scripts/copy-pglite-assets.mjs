#!/usr/bin/env node
/**
 * Nitro's Vercel function looks up PGLite's data/wasm files beside the bundled
 * module. Copy them into the function lib folder after `vite build` so a deploy
 * without DATABASE_URL can still boot the in-memory fallback.
 */
import { copyFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const dist = join(dirname(require.resolve("@electric-sql/pglite/package.json")), "dist");
const dest = join(process.cwd(), ".vercel/output/functions/__server.func/_libs");

if (!existsSync(dest)) {
  console.log("[pglite] function bundle not found — skip");
  process.exit(0);
}

for (const name of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
  const from = join(dist, name);
  if (!existsSync(from)) continue;
  copyFileSync(from, join(dest, name));
  console.log("[pglite] copied", name);
}
