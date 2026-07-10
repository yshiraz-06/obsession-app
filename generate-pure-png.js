const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// --- PURE NODE PNG ENCODER ---
function createPNG(width, height, rgbaBuffer) {
  // 1. PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // 2. IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // Bit depth
  ihdrData[9] = 6;  // Color type 6 = RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // 3. Prepare Scanlines with Filter Byte (0 = None)
  const scanlineLength = width * 4;
  const rawData = Buffer.alloc(height * (scanlineLength + 1));
  for (let y = 0; y < height; y++) {
    const offset = y * (scanlineLength + 1);
    rawData[offset] = 0; // Filter byte 0
    rgbaBuffer.copy(rawData, offset + 1, y * scanlineLength, (y + 1) * scanlineLength);
  }

  // 4. IDAT Chunk (Deflated scanlines)
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);

  // 5. IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const lengthBuf = Buffer.alloc(4);
  lengthBuf.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);

  // Calculate CRC32 of type + data
  const crcInput = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);

  return Buffer.concat([lengthBuf, crcInput, crcBuf]);
}

// CRC32 Table
let crcTable = null;
function makeCrcTable() {
  let c;
  crcTable = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xEDB88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c >>> 0;
  }
}

function crc32(buf) {
  if (!crcTable) makeCrcTable();
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// --- ICON RENDERER ---
function renderIcon(size, isForegroundOnly = false, isBackgroundOnly = false) {
  const buffer = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.46;
  const sqRadius = size * 0.24; // Squircle corner radius

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Check if point is inside rounded square background
      const insideBg = isInsideSquircle(x, y, size, sqRadius);

      if (isBackgroundOnly) {
        if (insideBg) {
          // Dark aesthetic background gradient #1E1E32 -> #08080E
          const t = (x + y) / (2 * size);
          buffer[idx]     = Math.round(30 * (1 - t) + 8 * t);
          buffer[idx + 1] = Math.round(30 * (1 - t) + 8 * t);
          buffer[idx + 2] = Math.round(50 * (1 - t) + 14 * t);
          buffer[idx + 3] = 255;
        } else {
          buffer[idx + 3] = 0; // Transparent outside squircle
        }
        continue;
      }

      // Initialize pixel to background (or transparent if foreground only)
      if (insideBg && !isForegroundOnly) {
        const t = (x + y) / (2 * size);
        buffer[idx]     = Math.round(30 * (1 - t) + 8 * t);
        buffer[idx + 1] = Math.round(30 * (1 - t) + 8 * t);
        buffer[idx + 2] = Math.round(50 * (1 - t) + 14 * t);
        buffer[idx + 3] = 255;
      } else {
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
      }

      // Distance from center
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Outer Glow Ring (#8B5CF6 -> #DB2777)
      const ringR = size * 0.27;
      const ringWidth = size * 0.055;
      const ringDist = Math.abs(dist - ringR);
      if (ringDist < ringWidth) {
        const alpha = Math.max(0, 1 - ringDist / ringWidth);
        const t = (x / size);
        const r = Math.round(139 * (1 - t) + 219 * t);
        const g = Math.round(92 * (1 - t) + 39 * t);
        const b = Math.round(246 * (1 - t) + 119 * t);
        blendPixel(buffer, idx, r, g, b, alpha * 0.95);
      }

      // Inner Core Ring (#C4B5FD -> #EC4899)
      const innerR = size * 0.18;
      const innerWidth = size * 0.028;
      const innerDist = Math.abs(dist - innerR);
      if (innerDist < innerWidth) {
        // Dashed angle check
        const angle = Math.atan2(dy, dx);
        if (Math.sin(angle * 6) > -0.2) {
          const alpha = Math.max(0, 1 - innerDist / innerWidth);
          const t = (y / size);
          const r = Math.round(196 * (1 - t) + 236 * t);
          const g = Math.round(181 * (1 - t) + 72 * t);
          const b = Math.round(253 * (1 - t) + 153 * t);
          blendPixel(buffer, idx, r, g, b, alpha);
        }
      }

      // Center Neural Pulse Wave / Heart-Chat Emblem
      const waveY = cy + Math.sin((x - cx) / (size * 0.05)) * (size * 0.04);
      if (Math.abs(x - cx) < size * 0.12 && Math.abs(y - waveY) < size * 0.022) {
        const alpha = Math.max(0, 1 - Math.abs(y - waveY) / (size * 0.022));
        blendPixel(buffer, idx, 255, 255, 255, alpha * 0.95);
      }

      // Center Red/Pink Core Dot (#F43F5E)
      if (dist < size * 0.035) {
        const alpha = Math.max(0, 1 - dist / (size * 0.035));
        blendPixel(buffer, idx, 244, 63, 94, alpha);
      }
    }
  }

  return createPNG(size, size, buffer);
}

function isInsideSquircle(x, y, size, r) {
  const margin = (size - (size - 32)) / 2; // Outer margin padding
  const x0 = r + 16;
  const x1 = size - r - 16;
  const y0 = r + 16;
  const y1 = size - r - 16;

  if (x >= x0 && x <= x1 && y >= y0 && y <= y1) return true;
  if (x < x0 && y < y0) return Math.hypot(x - x0, y - y0) <= r;
  if (x > x1 && y < y0) return Math.hypot(x - x1, y - y0) <= r;
  if (x < x0 && y > y1) return Math.hypot(x - x0, y - y1) <= r;
  if (x > x1 && y > y1) return Math.hypot(x - x1, y - y1) <= r;
  if (x >= 16 && x <= size - 16 && y >= 16 && y <= size - 16) {
    if (x >= x0 && x <= x1) return true;
    if (y >= y0 && y <= y1) return true;
  }
  return false;
}

function blendPixel(buf, idx, r, g, b, alpha) {
  if (alpha <= 0) return;
  if (alpha >= 1) {
    buf[idx]     = r;
    buf[idx + 1] = g;
    buf[idx + 2] = b;
    buf[idx + 3] = 255;
    return;
  }
  const existA = buf[idx + 3] / 255;
  const newA = alpha + existA * (1 - alpha);
  if (newA <= 0) return;
  buf[idx]     = Math.round((r * alpha + buf[idx] * existA * (1 - alpha)) / newA);
  buf[idx + 1] = Math.round((g * alpha + buf[idx + 1] * existA * (1 - alpha)) / newA);
  buf[idx + 2] = Math.round((b * alpha + buf[idx + 2] * existA * (1 - alpha)) / newA);
  buf[idx + 3] = Math.round(newA * 255);
}

console.log("Generating high-resolution icon PNGs...");

// Generate exact assets
const icon1024 = renderIcon(1024, false, false);
const fg1024 = renderIcon(1024, true, false);
const bg1024 = renderIcon(1024, false, true);
const fav192 = renderIcon(192, false, false);

fs.writeFileSync(path.join(__dirname, 'assets', 'icon.png'), icon1024);
fs.writeFileSync(path.join(__dirname, 'assets', 'android-icon-foreground.png'), fg1024);
fs.writeFileSync(path.join(__dirname, 'assets', 'android-icon-background.png'), bg1024);
fs.writeFileSync(path.join(__dirname, 'assets', 'favicon.png'), fav192);

fs.writeFileSync(path.join(__dirname, 'website', 'icon.png'), icon1024);
fs.writeFileSync(path.join(__dirname, 'website', 'favicon.png'), fav192);

console.log("Successfully generated all pixel-perfect PNG icons for both App and Website!");
