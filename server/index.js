import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import compression from 'compression';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zahra123';

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ---------- tiny JSON "database" ----------
const file = (name) => path.join(DATA_DIR, `${name}.json`);
function read(name, fallback) {
  try { return JSON.parse(fs.readFileSync(file(name), 'utf8')); } catch { return fallback; }
}
function write(name, value) {
  fs.writeFileSync(file(name), JSON.stringify(value, null, 2));
}
function removeUpload(url) {
  if (!url?.startsWith('/uploads/')) return;
  fs.rm(path.join(UPLOAD_DIR, path.basename(url)), { force: true }, () => {});
}

// ---------- uploads ----------
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, f, cb) =>
      cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${path.extname(f.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter: (_req, f, cb) => cb(null, /^image\//.test(f.mimetype)),
});

// Shrink an uploaded photo: max 1920px wide, WebP quality 82 (looks the same, ~10x smaller).
// Replaces the original file and returns the new public URL.
async function optimizeUpload(file) {
  const out = path.join(UPLOAD_DIR, `${path.parse(file.filename).name}.webp`);
  try {
    await sharp(file.path).rotate().resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5, smartSubsample: true }).toFile(out);
    if (out !== file.path) fs.rmSync(file.path, { force: true });
    return `/uploads/${path.basename(out)}`;
  } catch {
    return `/uploads/${file.filename}`; // unsupported format: keep the original
  }
}

// ---------- auth (simple password -> session token) ----------
const tokens = new Set();
function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (tokens.has(token)) return next();
  res.status(401).json({ error: 'Not authorised' });
}

const app = express();
app.use(compression());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d', immutable: true }));

app.post('/api/login', (req, res) => {
  if (req.body?.password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Wrong password' });
  const token = crypto.randomBytes(24).toString('hex');
  tokens.add(token);
  res.json({ token });
});
app.get('/api/check', auth, (_req, res) => res.json({ ok: true }));

// Generic CRUD for image collections (works + products)
function collection(name, fields) {
  app.get(`/api/${name}`, (_req, res) => res.json(read(name, [])));

  app.post(`/api/${name}`, auth, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Please choose an image' });
    const item = { id: crypto.randomUUID(), image: await optimizeUpload(req.file), createdAt: Date.now() };
    for (const f of fields) item[f] = (req.body[f] || '').trim();
    const list = read(name, []);
    list.unshift(item);
    write(name, list);
    res.status(201).json(item);
  });

  app.delete(`/api/${name}/:id`, auth, (req, res) => {
    const list = read(name, []);
    const item = list.find((i) => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    removeUpload(item.image);
    write(name, list.filter((i) => i.id !== item.id));
    res.json({ ok: true });
  });
}
collection('works', ['caption']);
collection('products', ['name', 'category', 'price']);

// Site settings (hero image)
app.get('/api/settings', (_req, res) => res.json(read('settings', {})));
app.post('/api/settings/hero', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please choose an image' });
  const settings = read('settings', {});
  removeUpload(settings.heroImage);
  settings.heroImage = await optimizeUpload(req.file);
  write('settings', settings);
  res.json(settings);
});
app.delete('/api/settings/hero', auth, (_req, res) => {
  const settings = read('settings', {});
  removeUpload(settings.heroImage);
  delete settings.heroImage;
  write('settings', settings);
  res.json(settings);
});

// Serve the built React site in production
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST, {
    setHeaders(res, file) {
      if (file.includes(`${path.sep}assets${path.sep}`)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      else if (file.includes(`${path.sep}images${path.sep}`) || /\.(webp|png)$/.test(file)) res.setHeader('Cache-Control', 'public, max-age=2592000');
      else res.setHeader('Cache-Control', 'no-cache'); // index.html: always fresh
    },
  }));
  app.get(/^\/(?!api|uploads).*/, (_req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));
}

app.use((err, _req, res, _next) => res.status(400).json({ error: err.message }));

app.listen(PORT, () => console.log(`Zahra Decor server on http://localhost:${PORT}`));
