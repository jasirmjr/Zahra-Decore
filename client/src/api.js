const TOKEN_KEY = 'zahra_admin_token';
export const getToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };
export const setToken = (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch {} };

// Shrink a photo in the browser before upload: max 1920px wide, WebP quality 0.82.
// Keeps uploads small (the server accepts up to 4 MB) and the site fast.
async function shrinkImage(file) {
  if (!(file instanceof File) || !file.type.startsWith('image/') || file.type === 'image/gif') return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, 1920 / bitmap.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/webp', 0.82));
    if (!blob || blob.type !== 'image/webp') return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
  } catch {
    return file;
  }
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
