// Generates the PNG favicons / app icons / social card from the SVG sources,
// plus the Windows desktop icon (build/icon.ico) for electron-builder.
// Run with: npm run make:images   (requires the dev dependency "sharp")
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';

const favicon = readFileSync('public/favicon.svg');
const og = readFileSync('branding/og-image.svg');

// High render density so downscaled raster icons stay crisp.
const icon = (size, file) =>
  sharp(favicon, { density: 600 }).resize(size, size).png().toFile(`public/${file}`);

await icon(32, 'favicon-32.png');
await icon(180, 'apple-touch-icon.png');
await icon(192, 'icon-192.png');
await icon(512, 'icon-512.png');

await sharp(og, { density: 96 }).resize(1200, 630).png().toFile('public/og-image.png');

// ---------- Windows desktop icon (build/icon.ico) ----------
// Assemble a multi-resolution .ico with PNG-compressed entries (Vista+),
// so the .exe, installer and desktop shortcut all use the brand icon.
const pngBuffer = (size) =>
  sharp(favicon, { density: 600 }).resize(size, size).png().toBuffer();

function buildIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(count, 4); // image count

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count; // image data starts after header + directory
  images.forEach(({ size, data }, i) => {
    const e = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, e + 0); // width (0 => 256)
    dir.writeUInt8(size >= 256 ? 0 : size, e + 1); // height (0 => 256)
    dir.writeUInt8(0, e + 2); // palette count
    dir.writeUInt8(0, e + 3); // reserved
    dir.writeUInt16LE(1, e + 4); // color planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(data.length, e + 8); // image data size
    dir.writeUInt32LE(offset, e + 12); // offset to image data
    offset += data.length;
  });

  return Buffer.concat([header, dir, ...images.map((im) => im.data)]);
}

const icoSizes = [16, 24, 32, 48, 64, 128, 256];
const icoImages = await Promise.all(
  icoSizes.map(async (size) => ({ size, data: await pngBuffer(size) }))
);

mkdirSync('build', { recursive: true });
const { writeFileSync } = await import('node:fs');
writeFileSync('build/icon.ico', buildIco(icoImages));
// 512px PNG kept alongside as a source/fallback for other platforms.
await sharp(favicon, { density: 600 }).resize(512, 512).png().toFile('build/icon.png');

console.log(
  '✓ Generated favicon-32, apple-touch-icon, icon-192, icon-512, og-image, build/icon.ico'
);
