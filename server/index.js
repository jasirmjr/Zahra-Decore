// Zahra Decor API — the "server" Vercel service (Express). Locally: server/dev.js.
// Photos and data are stored in Vercel Blob, because Vercel has no persistent disk.
import express from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import { put, del, list } from '@vercel/blob';

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

// Generic CRUD for image collections (works + products)
function collection(name, fields) {
  app.get(`/api/${name}`, wrap(async (_req, res) => { publicCache(res); res.json(await read(name, [])); }));

  app.post(`/api/${name}`, auth, upload.single('image'), wrap(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Please choose an image' });
    const item = { id: crypto.randomUUID(), image: await saveUpload(req.file), createdAt: Date.now() };
    for (const f of fields) item[f] = (req.body[f] || '').trim();
    const list = await read(name, []);
    list.unshift(item);
    await write(name, list);
    res.status(201).json(item);
  }));

  app.delete(`/api/${name}/:id`, auth, wrap(async (req, res) => {
    const list = await read(name, []);
    const item = list.find((i) => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await removeUpload(item.image);
    await write(name, list.filter((i) => i.id !== item.id));
    res.json({ ok: true });
  }));
}
collection('works', ['caption']);
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
