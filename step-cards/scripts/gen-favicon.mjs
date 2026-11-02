/**
 * Generates public/favicon.ico and public/favicon.svg for Step Cards.
 * Run: node scripts/gen-favicon.mjs
 * No external deps — uses only built-in Node.js (zlib, fs).
 */

import { deflateSync } from "zlib";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── SVG favicon (modern browsers) ────────────────────────────────────────────
// Design: rounded indigo square, three white ascending step-card rectangles
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#6366f1"/>
  <!-- three ascending step cards (bottom → top, left → right) -->
  <rect x="5"  y="19" width="8" height="7" rx="1.5" fill="white" opacity="0.95"/>
  <rect x="12" y="13" width="8" height="7" rx="1.5" fill="white" opacity="0.95"/>
  <rect x="19" y="7"  width="8" height="7" rx="1.5" fill="white" opacity="0.95"/>
</svg>`;

writeFileSync(join(root, "public/favicon.svg"), svg);
console.log("✓ favicon.svg written");

// ── PNG helper (pure Node.js, no deps) ───────────────────────────────────────
function u32be(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n, 0);
  return b;
}

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();

function crc32(buf, seed = 0xffffffff) {
  let c = seed;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const tb = Buffer.from(type, "ascii");
  const crcBuf = Buffer.concat([tb, data]);
  return Buffer.concat([u32be(data.length), tb, data, u32be(crc32(crcBuf))]);
}

function makePng(size, drawFn) {
  // RGBA pixel buffer
  const px = new Uint8Array(size * size * 4);

  function setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    const i = (y * size + x) * 4;
    px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = a;
  }

  function fillRect(x, y, w, h, r, g, b, a = 255) {
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++)
        setPixel(x + dx, y + dy, r, g, b, a);
  }

  function fillRoundRect(x, y, w, h, radius, r, g, b, a = 255) {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const cx = x + dx, cy = y + dy;
        // corner checks
        const corners = [
          [x + radius, y + radius],
          [x + w - 1 - radius, y + radius],
          [x + radius, y + h - 1 - radius],
          [x + w - 1 - radius, y + h - 1 - radius],
        ];
        let inCorner = false;
        for (const [ox, oy] of corners) {
          if (Math.abs(cx - ox) > radius || Math.abs(cy - oy) > radius) continue;
          const dist = Math.sqrt((cx - ox) ** 2 + (cy - oy) ** 2);
          if (dist > radius + 0.5) { inCorner = true; break; }
        }
        if (!inCorner) setPixel(cx, cy, r, g, b, a);
      }
    }
  }

  drawFn({ fillRect, fillRoundRect, size });

  // Build raw PNG rows (filter byte 0 = None per row)
  const raw = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 4)] = 0; // filter byte
    raw.set(px.subarray(y * size * 4, (y + 1) * size * 4), y * (1 + size * 4) + 1);
  }

  const ihdr = Buffer.concat([
    u32be(size), u32be(size),
    Buffer.from([8, 6, 0, 0, 0]), // 8-bit RGBA
  ]);
  const idat = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), // PNG sig
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idat),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function drawStepCards({ fillRect, fillRoundRect, size }) {
  const s = size;
  // Background: indigo #6366f1 (r99 g102 b241)
  fillRoundRect(0, 0, s, s, Math.round(s * 0.22), 99, 102, 241);

  // Three white step cards (scaled to icon size)
  const cardW = Math.round(s * 0.28);
  const cardH = Math.round(s * 0.25);
  const step  = Math.round(s * 0.19);
  const startX = Math.round(s * 0.14);
  const startY = Math.round(s * 0.56);

  for (let i = 0; i < 3; i++) {
    const cx = startX + i * step;
    const cy = startY - i * step;
    fillRoundRect(cx, cy, cardW, cardH, Math.round(s * 0.06), 255, 255, 255);
  }
}

// Generate three sizes: 16, 32, 48
const sizes = [16, 32, 48];
const pngs = sizes.map((sz) => makePng(sz, drawStepCards));

// ── ICO format ───────────────────────────────────────────────────────────────
// Header: ICONDIR (6 bytes) + entries (16 bytes each)
const headerSize = 6 + sizes.length * 16;
let dataOffset = headerSize;

const entries = pngs.map((png, i) => {
  const sz = sizes[i];
  const entry = Buffer.alloc(16);
  entry[0] = sz === 256 ? 0 : sz; // width (0 = 256)
  entry[1] = sz === 256 ? 0 : sz; // height
  entry[2] = 0;   // color count (0 = no palette)
  entry[3] = 0;   // reserved
  entry.writeUInt16LE(1, 4);  // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(dataOffset, 12);
  dataOffset += png.length;
  return entry;
});

const icondir = Buffer.alloc(6);
icondir.writeUInt16LE(0, 0); // reserved
icondir.writeUInt16LE(1, 2); // type = icon
icondir.writeUInt16LE(sizes.length, 4);

const ico = Buffer.concat([icondir, ...entries, ...pngs]);
writeFileSync(join(root, "public/favicon.ico"), ico);
console.log("✓ favicon.ico written (16×16, 32×32, 48×48)");
