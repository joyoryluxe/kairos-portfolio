/**
 * optimize-images.mjs
 * Run once: node scripts/optimize-images.mjs
 * ─────────────────────────────────────────────
 * • Resizes images to max 1920 px wide (keeps ratio)
 * • Re-encodes JPG/PNG at quality 82 → smaller original
 * • Generates .webp siblings (q=80, lossless for PNG)
 * • Generates a tiny base64 placeholder for blur effect
 * • Saves a manifest to src/data/imageManifest.json
 */

import sharp from 'sharp';
import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const PUBLIC_DIR = './public';
const MANIFEST_PATH = './src/data/imageManifest.json';
const MAX_WIDTH   = 1920;
const JPEG_Q      = 82;
const WEBP_Q      = 80;
const PNG_Q       = 90;          // PNG webp quality
const BLUR_WIDTH  = 20;          // For tiny placeholder

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png']);

const manifest = {};

async function processFile(filePath) {
  const ext  = extname(filePath).toLowerCase();
  if (!IMAGE_EXTS.has(ext)) return;

  const fileName = basename(filePath);
  const name     = basename(filePath, ext);
  const dir      = filePath.replace(basename(filePath), '');
  const webpPath = join(dir, `${name}.webp`);

  // ── Read metadata
  let meta;
  try { meta = await sharp(filePath).metadata(); } catch (e) { 
    console.warn(`⚠️  Could not read metadata for ${fileName}: ${e.message}`);
    return; 
  }

  const needsResize = meta.width && meta.width > MAX_WIDTH;

  // ── Shared pipeline base
  const pipe = () => {
    const s = sharp(filePath);
    if (needsResize) s.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    return s;
  };

  // ── 1. Generate Tiny Base64 Placeholder
  try {
    const blurBuf = await sharp(filePath)
      .resize(BLUR_WIDTH)
      .blur(5)
      .toFormat('webp', { quality: 20 })
      .toBuffer();
    
    const base64 = `data:image/webp;base64,${blurBuf.toString('base64')}`;
    manifest[fileName] = {
      webp: `${name}.webp`,
      placeholder: base64,
      width: meta.width,
      height: meta.height
    };
  } catch (e) {
    console.warn(`   ⚠️  Placeholder failed for ${fileName}: ${e.message}`);
  }

  // ── 2. Generate WebP sibling
  try {
    await pipe().webp({ quality: WEBP_Q }).toFile(webpPath);
    console.log(`   🌐 WebP → ${basename(webpPath)} created.`);
  } catch (e) {
    console.warn(`   ⚠️  WebP failed for ${fileName}: ${e.message}`);
  }

  // ── 3. Re-encode original (overwrite) - DO THIS LAST
  try {
    let buf;
    if (ext === '.png') {
      buf = await pipe().png({ quality: PNG_Q, compressionLevel: 9 }).toBuffer();
    } else {
      buf = await pipe().jpeg({ quality: JPEG_Q, mozjpeg: true }).toBuffer();
    }

    await writeFile(filePath, buf);
    const savedKB = ((meta.size ?? 0) - buf.length) / 1024;
    console.log(`✅  ${fileName}  →  ${(buf.length/1024).toFixed(0)} KB  (saved ${savedKB.toFixed(0)} KB)`);
  } catch (e) {
    console.warn(`⚠️  Could not compress original ${fileName} (it might be locked): ${e.message}`);
    // We don't return here so manifest still gets saved
  }
}

async function run() {
  console.log('🔍 Scanning public/ for images and generating manifest…\n');
  const files = await readdir(PUBLIC_DIR);
  
  // Sequential to avoid issues
  for (const f of files) {
    await processFile(join(PUBLIC_DIR, f));
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n🎉 Done! Manifest saved to ${MANIFEST_PATH}`);
}

run().catch(console.error);
