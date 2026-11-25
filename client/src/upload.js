// Admin uploads: files go straight from the browser to Vercel Blob (no 4.5 MB server limit),
// then the item details are saved through the API. Used only by the admin panel.
import { upload } from '@vercel/blob/client';
import { getToken, loadBitmap, encode, asFile, toDataUrl, fullPhoto } from './api';

export const isVideo = (f) => f.type.startsWith('video/');
export const MAX_VIDEO_MB = 500;

const send = (file, onProgress) =>
  upload(`uploads/${file.name.replace(/[^\w.-]+/g, '-')}`, file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
    headers: { Authorization: `Bearer ${getToken()}` },
    multipart: file.size > 8 * 1024 * 1024, // big files go up in parallel chunks
    onUploadProgress: onProgress ? ({ percentage }) => onProgress(percentage) : undefined,
  }).then((b) => b.url);

// Grab a frame ~1s in as the video's poster. Some formats (e.g. iPhone HEVC on Windows) can't be
// decoded by the browser — then there is simply no poster and a dark tile with a play icon is shown.
function videoFrame(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement('video');
    const done = (r) => { URL.revokeObjectURL(url); resolve(r); };
    const timer = setTimeout(() => done(null), 15000);
    v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = url;
    v.onerror = () => { clearTimeout(timer); done(null); };
    v.onloadedmetadata = () => { v.currentTime = Math.min(1, (v.duration || 0) / 2); };
    v.onseeked = async () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = v.videoWidth; canvas.height = v.videoHeight;
        canvas.getContext('2d').drawImage(v, 0, 0);
        done({ bitmap: await createImageBitmap(canvas), w: v.videoWidth, h: v.videoHeight });
      } catch { done(null); }
    };
  });
}

// Upload one photo or video and return the item fields for the API.
//  onProgress(percent 0-100)
export async function uploadMedia(file, onProgress = () => {}) {
  if (isVideo(file)) {
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) throw new Error(`Video is larger than ${MAX_VIDEO_MB} MB`);
    const item = {};
    const frame = await videoFrame(file);
    if (frame) {
      const [poster, thumb, tiny] = await Promise.all([
        encode(frame.bitmap, 1920, 0.85), encode(frame.bitmap, 800, 0.82), encode(frame.bitmap, 24, 0.5),
      ]);
      Object.assign(item, { w: frame.w, h: frame.h, blur: tiny ? await toDataUrl(tiny) : undefined });
      if (poster) item.image = await send(asFile(poster, file.name, '-poster'));
      if (thumb) item.thumb = await send(asFile(thumb, file.name, '-thumb'));
    }
    onProgress(3);
    item.video = await send(file, (p) => onProgress(Math.max(3, p)));
    return item;
  }

  // Photo: full quality (up to 2560px) + 800px grid thumbnail + tiny blurred preview
  let bitmap = null;
  try { bitmap = await loadBitmap(file); } catch { /* unsupported format: upload as-is */ }
  if (!bitmap) return { image: await send(file, onProgress) };
  const [full, thumb, tiny] = await Promise.all([fullPhoto(bitmap, file), encode(bitmap, 800, 0.82), encode(bitmap, 24, 0.5)]);
  const item = { w: bitmap.width, h: bitmap.height, blur: tiny ? await toDataUrl(tiny) : undefined };
  if (thumb) item.thumb = await send(asFile(thumb, file.name, '-thumb'));
  item.image = await send(full, onProgress);
  return item;
}
