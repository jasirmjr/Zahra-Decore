const TOKEN_KEY = 'zahra_admin_token';
export const getToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };
export const setToken = (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch {} };

// ---------- photos are prepared in the browser before upload ----------
// Vercel accepts at most ~4.5 MB per request, so the full photo + thumbnail must stay under that.
const MAX_BYTES = 3.6 * 1024 * 1024;

export const loadBitmap = (file) => createImageBitmap(file, { imageOrientation: 'from-image' });

export function encode(bitmap, maxW, quality) {
  const scale = Math.min(1, maxW / bitmap.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((r) => canvas.toBlob((b) => r(b?.type === 'image/webp' ? b : null), 'image/webp', quality));
}
export const asFile = (blob, name, suffix = '') => new File([blob], name.replace(/\.[^.]+$/, '') + suffix + '.webp', { type: 'image/webp' });
export const toDataUrl = (blob) => new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });

const usable = (f) => f instanceof File && f.type.startsWith('image/') && f.type !== 'image/gif';

// Full photo: high quality (up to 2560px, WebP 0.9), stepping down only if it would be too big to upload.
export async function fullPhoto(bitmap, file) {
  for (const [w, q] of [[2560, 0.9], [2560, 0.85], [2048, 0.85], [1920, 0.8]]) {
    const blob = await encode(bitmap, w, q);
    if (!blob) return file;
    if (blob.size <= MAX_BYTES) return asFile(blob, file.name);
  }
  return asFile(await encode(bitmap, 1600, 0.8), file.name);
}

// Single photo (hero image): just the high-quality full version.
async function shrinkImage(file) {
  if (!usable(file)) return file;
  try { return await fullPhoto(await loadBitmap(file), file); } catch { return file; }
}

export async function api(path, { method = 'GET', body, auth, fresh } = {}) {
  const headers = {};
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (body instanceof FormData && body.get('image')) body.set('image', await shrinkImage(body.get('image')));
  const url = `/api${path}${fresh ? `${path.includes('?') ? '&' : '?'}fresh=${Date.now()}` : ''}`;
  const res = await fetch(url, {
    method, headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status });
  return data;
}
