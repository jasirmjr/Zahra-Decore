// Zahra Decor API — the "server" Vercel service (Express). Locally: server/dev.js.
// Photos and data are stored in Vercel Blob, because Vercel has no persistent disk.
import express from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { put, del, list } from '@vercel/blob';
import { handleUpload } from '@vercel/blob/client';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zahra123';
const TOKEN_DAYS = 30;

// ---------- tiny JSON "database" in Blob ----------
// Each save writes a new uniquely-named file (so no stale CDN copies) and removes the older ones.
async function read(name, fallback) {
  const { blobs } = await list({ prefix: `data/${name}/` });
  if (!blobs.length) return fallback;
  const latest = blobs.reduce((a, b) => (new Date(b.uploadedAt) > new Date(a.uploadedAt) ? b : a));
  const res = await fetch(latest.url, { cache: 'no-store' });
  return res.ok ? res.json() : fallback;
}
async function write(name, value) {
  const { blobs: old } = await list({ prefix: `data/${name}/` });
  await put(`data/${name}/${Date.now()}.json`, JSON.stringify(value), {
    access: 'public', addRandomSuffix: true, contentType: 'application/json',
  });
  if (old.length) await del(old.map((b) => b.url));
}
async function removeUpload(url) {
  if (url && /\.blob\.vercel-storage\.com\//.test(url)) await del(url).catch(() => {});
}

// ---------- uploads (photos are shrunk to WebP in the browser before upload) ----------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }, // Vercel request limit is 4.5 MB
  fileFilter: (_req, f, cb) => cb(null, /^image\//.test(f.mimetype)),
});
async function saveUpload(file) {
  const ext = ({ 'image/webp': '.webp', 'image/jpeg': '.jpg', 'image/png': '.png' })[file.mimetype] || '';
  const blob = await put(`uploads/${crypto.randomUUID()}${ext}`, file.buffer, {
    access: 'public', contentType: file.mimetype, cacheControlMaxAge: 60 * 60 * 24 * 365,
  });
  return blob.url;
}

// ---------- auth: signed token (works across serverless instances) ----------
const sign = (exp) => crypto.createHmac('sha256', ADMIN_PASSWORD).update(String(exp)).digest('hex');
function auth(req, res, next) {
  const [exp, sig] = (req.headers.authorization || '').replace('Bearer ', '').split('.');
  if (sig && Number(exp) > Date.now() && sig === sign(exp)) return next();
  res.status(401).json({ error: 'Not authorised' });
}

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
// Public reads are cached briefly on Vercel's CDN; the admin panel adds ?fresh=... to bypass.
const publicCache = (res) => res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=86400');

const app = express();
app.use(express.json());

app.post('/api/login', (req, res) => {
  if (req.body?.password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Wrong password' });
  const exp = Date.now() + TOKEN_DAYS * 86400000;
  res.json({ token: `${exp}.${sign(exp)}` });
});
app.get('/api/check', auth, (_req, res) => res.json({ ok: true }));

// ---------- direct uploads (photos + videos) ----------
// The admin browser uploads files straight to Vercel Blob, so videos are not limited by
// Vercel's 4.5 MB request size. This route only hands out a short-lived upload permission.
const MAX_UPLOAD_MB = 500;
app.post('/api/upload', auth, wrap(async (req, res) => {
  res.json(await handleUpload({
    request: req,
    body: req.body,
    onBeforeGenerateToken: async (pathname) => {
      if (!pathname.startsWith('uploads/')) throw new Error('Invalid upload path');
      return {
        allowedContentTypes: ['image/*', 'video/*'],
        maximumSizeInBytes: MAX_UPLOAD_MB * 1024 * 1024,
        addRandomSuffix: true,
        cacheControlMaxAge: 60 * 60 * 24 * 365,
      };
    },
  }));
}));

// ---------- collections (projects + gallery + products) ----------
// After uploading, the browser sends one item: { image, thumb?, video?, w?, h?, blur?, ...fields }.
//  photo: image = full quality, thumb = small grid version
//  video: video = the file, image/thumb = a poster frame (if the browser could make one)
const num = (v) => (Number(v) > 0 ? Math.round(Number(v)) : undefined);
const blobUrl = (v) => (typeof v === 'string' && /^https:\/\/[a-z0-9.-]+\.blob\.vercel-storage\.com\//i.test(v) ? v : undefined);

const DEFAULT_PUBLIC_WORKS = [
  {
    id: 'public-work-video-1',
    type: 'video',
    video: '/work-video-1.mp4',
    image: '/work-video-1-poster.jpg',
    thumb: '/work-video-1-poster.jpg',
    caption: 'In-House Manufacturing',
    w: 1280,
    h: 720,
    createdAt: 1700000000000,
  },
  {
    id: 'public-work-video-2',
    type: 'video',
    video: '/work-video-2.mp4',
    image: '/work-video-2-poster.jpg',
    thumb: '/work-video-2-poster.jpg',
    caption: 'Completed Interior Installation',
    w: 1280,
    h: 720,
    createdAt: 1700000001000,
  },
];

async function getCollectionItems(name) {
  if (name === 'works') {
    const items = await read('works', null);
    const deleted = await read('deleted-works', []);
    let list = items;
    if (list === null) {
      list = DEFAULT_PUBLIC_WORKS.filter((d) => !deleted.includes(d.id));
      await write('works', list);
      return list;
    }
    let changed = false;
    for (const def of DEFAULT_PUBLIC_WORKS) {
      if (!deleted.includes(def.id) && !list.some((item) => item.id === def.id || item.video === def.video)) {
        list.push(def);
        changed = true;
      }
    }
    if (changed) {
      await write('works', list);
    }
    return list;
  }
  return await read(name, []);
}

function collection(name, fields, { videos = false } = {}) {
  app.get(`/api/${name}`, wrap(async (_req, res) => {
    publicCache(res);
    res.json(await getCollectionItems(name));
  }));

  app.post(`/api/${name}`, auth, wrap(async (req, res) => {
    const b = req.body || {};
    const video = videos ? blobUrl(b.video) : undefined;
    const image = blobUrl(b.image);
    if (!image && !video) return res.status(400).json({ error: 'Please choose a photo' + (videos ? ' or video' : '') });
    const item = {
      id: crypto.randomUUID(),
      type: video ? 'video' : 'image',
      image, video,
      thumb: blobUrl(b.thumb),
      w: num(b.w), h: num(b.h),
      blur: /^data:image\/(webp|jpeg);base64,[A-Za-z0-9+/=]{1,4000}$/.test(b.blur || '') ? b.blur : undefined,
      createdAt: Date.now(),
    };
    for (const f of fields) item[f] = String(b[f] || '').trim().slice(0, 200);
    const items = await getCollectionItems(name);
    items.unshift(item);
    await write(name, items);
    res.status(201).json(item);
  }));

  app.delete(`/api/${name}/:id`, auth, wrap(async (req, res) => {
    const items = await getCollectionItems(name);
    const item = items.find((i) => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });

    // Track deletion of public default works so they won't re-seed
    if (name === 'works' && req.params.id.startsWith('public-work-video-')) {
      const deleted = await read('deleted-works', []);
      if (!deleted.includes(req.params.id)) {
        deleted.push(req.params.id);
        await write('deleted-works', deleted);
      }
      try {
        const pubDir = path.resolve(process.cwd(), 'client/public');
        if (item.video && item.video.startsWith('/')) {
          const vPath = path.join(pubDir, item.video.replace(/^\//, ''));
          if (fs.existsSync(vPath)) fs.unlinkSync(vPath);
        }
        if (item.image && item.image.startsWith('/')) {
          const pPath = path.join(pubDir, item.image.replace(/^\//, ''));
          if (fs.existsSync(pPath)) fs.unlinkSync(pPath);
        }
      } catch {
        // Non-fatal
      }
    }

    await Promise.all([removeUpload(item.image), removeUpload(item.thumb), removeUpload(item.video)]);
    await write(name, items.filter((i) => i.id !== item.id));
    res.json({ ok: true });
  }));
}
// "works" is shown on the site as "Projects" (kept as "works" so existing uploads stay)
collection('works', ['caption'], { videos: true });
collection('gallery', ['caption', 'category'], { videos: true });
collection('products', ['name', 'category', 'price']);

// Site settings (hero image)
app.get('/api/settings', wrap(async (_req, res) => { publicCache(res); res.json(await read('settings', {})); }));
app.post('/api/settings/hero', auth, upload.single('image'), wrap(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please choose an image' });
  const settings = await read('settings', {});
  await removeUpload(settings.heroImage);
  settings.heroImage = await saveUpload(req.file);
  await write('settings', settings);
  res.json(settings);
}));
app.delete('/api/settings/hero', auth, wrap(async (_req, res) => {
  const settings = await read('settings', {});
  await removeUpload(settings.heroImage);
  delete settings.heroImage;
  await write('settings', settings);
  res.json(settings);
}));

app.use((err, _req, res, _next) => res.status(400).json({ error: err.message }));

export default app;
