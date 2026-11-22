// Converts every photo in /image-originals into small, sharp WebP files in client/public/images.
// Run again whenever you add a new photo:   npm run images
//
//   image-originals/sofa-brown.jpg  ->  client/public/images/sofa-brown-640.webp, -960, -1280, -1920, -2560
//   image-originals/logo.png        ->  client/public/logo.webp (+ small favicon.png)
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'image-originals');
const OUT = path.join(ROOT, 'client', 'public', 'images');
const WIDTHS = [640, 960, 1280, 1920, 2560];
const QUALITY = 82; // visually identical to the original on screen

fs.mkdirSync(OUT, { recursive: true });
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
let before = 0, after = 0;

for (const file of fs.readdirSync(SRC)) {
  const input = path.join(SRC, file);
  const name = path.parse(file).name;
  before += fs.statSync(input).size;

  if (name === 'logo') {
    const out = path.join(ROOT, 'client', 'public', 'logo.webp');
    await sharp(input).resize({ height: 300, withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(out);
    await sharp(input).resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }).toFile(path.join(ROOT, 'client', 'public', 'favicon.png'));
    after += fs.statSync(out).size;
    console.log(`logo  -> ${kb(fs.statSync(out).size)}`);
    continue;
  }
  if (!/\.(jpe?g|png|webp|avif|tiff?)$/i.test(file)) continue;

  const { width } = await sharp(input).metadata();
  const sizes = [];
  for (const w of WIDTHS) {
    if (w > width && w !== WIDTHS[0]) continue;
    const out = path.join(OUT, `${name}-${w}.webp`);
    await sharp(input).rotate().resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6, smartSubsample: true }).toFile(out);
    const size = fs.statSync(out).size;
    if (w === 1920) after += size;
    sizes.push(`${w}:${kb(size)}`);
  }
  console.log(`${name.padEnd(20)} ${sizes.join('  ')}`);
}
console.log(`\nOriginals: ${kb(before)}  ->  typical desktop download (1920px versions): ${kb(after)}`);
