// node scripts/generate-icons.cjs
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = 'C:/Users/erikf/OneDrive/Desktop/Sliss_logo_png.png';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function getModifiedBuffer() {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const pixels = new Uint8Array(data);

  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i], g = pixels[i+1], b = pixels[i+2], a = pixels[i+3];
    const luminance = (r + g + b) / 3;
    const isGreen = g > r * 1.3 && g > b * 1.3 && g > 100;
    if (a > 64 && isGreen && luminance > 130) {
      pixels[i] = pixels[i+1] = pixels[i+2] = 255;
    }
  }
  return { buffer: Buffer.from(pixels.buffer), width, height, channels };
}

async function generateA(size) {
  const { buffer, width, height, channels } = await getModifiedBuffer();
  const logoBuffer = await sharp(buffer, { raw: { width, height, channels } })
    .resize(Math.round(size * 0.85), Math.round(size * 0.5), { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png().toBuffer();

  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 255 } } })
    .composite([{ input: logoBuffer, gravity: 'centre' }])
    .png()
    .toFile(path.join(OUTPUT_DIR, `icon-${size}.png`));

  console.log(`icon-${size}.png`);
}

async function main() {
  await generateA(192);
  await generateA(512);
}
main().catch(console.error);
