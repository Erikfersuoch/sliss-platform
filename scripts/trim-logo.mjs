// Usa-e-getta: ritaglia i margini trasparenti di un PNG RGBA 8-bit (no interlace).
// Solo moduli built-in di Node (zlib). Nessuna dipendenza nuova.
import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";

const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function readChunks(buf) {
  let off = 8;
  const chunks = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    chunks.push({ type, data });
    off += 12 + len;
  }
  return chunks;
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (~c) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function decode(buf) {
  const chunks = readChunks(buf);
  const ihdr = chunks.find(c => c.type === "IHDR").data;
  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const bitDepth = ihdr[8];
  const colorType = ihdr[9];
  const interlace = ihdr[12];
  if (bitDepth !== 8 || colorType !== 6 || interlace !== 0)
    throw new Error(`Atteso RGBA 8-bit non interlacciato (depth=${bitDepth} color=${colorType} interlace=${interlace})`);
  const bpp = 4;
  const idat = Buffer.concat(chunks.filter(c => c.type === "IDAT").map(c => c.data));
  const raw = inflateSync(idat);
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  let pos = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[pos++];
    for (let x = 0; x < stride; x++) {
      const val = raw[pos++];
      const a = x >= bpp ? out[y * stride + x - bpp] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = (x >= bpp && y > 0) ? out[(y - 1) * stride + x - bpp] : 0;
      let recon;
      switch (filter) {
        case 0: recon = val; break;
        case 1: recon = val + a; break;
        case 2: recon = val + b; break;
        case 3: recon = val + ((a + b) >> 1); break;
        case 4: recon = val + paeth(a, b, c); break;
        default: throw new Error("Filtro PNG sconosciuto: " + filter);
      }
      out[y * stride + x] = recon & 0xff;
    }
  }
  return { width, height, bpp, pixels: out };
}

function alphaBBox({ width, height, bpp, pixels }, threshold = 8) {
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = pixels[(y * width + x) * bpp + 3];
      if (alpha > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, minY, maxX, maxY };
}

function encode(width, height, bpp, pixels) {
  const stride = width * bpp;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filtro None
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // color type RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    SIG,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const [, , inPath, outPath, padArg] = process.argv;
const pad = padArg ? parseInt(padArg, 10) : 0;
const img = decode(readFileSync(inPath));
const bb = alphaBBox(img);
const minX = Math.max(0, bb.minX - pad), minY = Math.max(0, bb.minY - pad);
const maxX = Math.min(img.width - 1, bb.maxX + pad), maxY = Math.min(img.height - 1, bb.maxY + pad);
const nw = maxX - minX + 1, nh = maxY - minY + 1;
const cropped = Buffer.alloc(nw * nh * img.bpp);
for (let y = 0; y < nh; y++) {
  const srcStart = ((minY + y) * img.width + minX) * img.bpp;
  img.pixels.copy(cropped, y * nw * img.bpp, srcStart, srcStart + nw * img.bpp);
}
writeFileSync(outPath, encode(nw, nh, img.bpp, cropped));
console.log(`${inPath} (${img.width}x${img.height}) -> ${outPath} (${nw}x${nh}), ratio ${(nw / nh).toFixed(2)}:1`);
