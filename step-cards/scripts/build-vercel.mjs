/**
 * Post-build script: reorganizes TanStack Start output into
 * Vercel Build Output API v3 format (.vercel/output/).
 *
 * Run via:  node scripts/build-vercel.mjs
 * Called by: npm run build:vercel
 */

import { execSync } from "child_process";
import { mkdirSync, writeFileSync, cpSync, existsSync, rmSync } from "fs";
import { join } from "path";

// ── 1. Regular vite build ──────────────────────────────────────────────────
console.log("Building…");
execSync("vite build", { stdio: "inherit" });

// ── 2. Set up .vercel/output ───────────────────────────────────────────────
const out = ".vercel/output";
if (existsSync(out)) rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "functions/ssr.func"), { recursive: true });
mkdirSync(join(out, "static"), { recursive: true });

// ── 3. config.json ─────────────────────────────────────────────────────────
writeFileSync(
  join(out, "config.json"),
  JSON.stringify({
    version: 3,
    routes: [
      // Serve pre-built static assets directly
      { src: "/assets/(.*)", dest: "/assets/$1" },
      { src: "/favicon.ico", dest: "/favicon.ico" },
      { src: "/robots.txt", dest: "/robots.txt" },
      // Everything else → SSR function
      { handle: "filesystem" },
      { src: "/(.*)", dest: "/ssr" },
    ],
  })
);

// ── 4. Static files (dist/client → .vercel/output/static) ─────────────────
cpSync("dist/client", join(out, "static"), { recursive: true });

// ── 5. SSR serverless function ─────────────────────────────────────────────
// Copy the entire dist/server/ bundle into the function directory so that
// server.js relative imports (./assets/…) resolve correctly at runtime.
cpSync("dist/server", join(out, "functions/ssr.func/dist/server"), {
  recursive: true,
});

// Node.js HTTP adapter that wraps the Web Fetch API handler
writeFileSync(
  join(out, "functions/ssr.func/index.js"),
  `
import server from "./dist/server/server.js";

export default async function handler(req, res) {
  const proto = req.headers["x-forwarded-proto"] ?? "https";
  const host  = req.headers["host"] ?? "localhost";
  const url   = new URL(req.url, \`\${proto}://\${host}\`);

  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v != null) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  }

  let body;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    body = chunks.length ? Buffer.concat(chunks) : undefined;
  }

  const request  = new Request(url.toString(), { method: req.method, headers, body });
  const response = await server.fetch(request);

  const respHeaders = {};
  response.headers.forEach((v, k) => { respHeaders[k] = v; });
  res.writeHead(response.status, respHeaders);
  res.end(Buffer.from(await response.arrayBuffer()));
}
`.trim()
);

writeFileSync(
  join(out, "functions/ssr.func/package.json"),
  JSON.stringify({ type: "module" })
);

writeFileSync(
  join(out, "functions/ssr.func/.vc-config.json"),
  JSON.stringify({
    runtime: "nodejs22.x",
    handler: "index.js",
    launcherType: "Nodejs",
    shouldAddHelpers: false,
  })
);

console.log("✓ .vercel/output ready");
