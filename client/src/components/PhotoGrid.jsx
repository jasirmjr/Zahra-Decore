// Fast photo/video grid for admin uploads (Projects + Gallery).
//  - Videos show their poster frame + a play badge, and play in the lightbox (nothing downloads before that).
//  - Grid shows the small "thumb" (~800px); the full-quality photo loads only in the lightbox.
//  - Each tile reserves its exact size (w/h) and shows a blurred preview, so nothing jumps while loading.
//  - Older uploads without a thumbnail fall back to the full image.
import { useEffect, useState } from 'react';
import { CloseIcon, ChevronLeft, ChevronRight } from './Icons';

export function UploadedPhoto({ item, className = '', imgClassName = '', fill = false, eager = false, aspect = '4 / 3' }) {
  const [loaded, setLoaded] = useState(false);
  const isVid = Boolean(item.video);

  return (
    <div
      className={`relative overflow-hidden bg-neutral-900 ${className}`}
      style={{
        aspectRatio: fill ? undefined : aspect,
        backgroundImage: item.blur ? `url(${item.blur})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {isVid ? (
        <video
          src={`${item.video}#t=0.5`}
          poster={item.thumb || item.image}
          preload="metadata"
          muted
          playsInline
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      ) : (item.thumb || item.image) ? (
        <img
          src={item.thumb || item.image}
          alt={item.caption || item.name || ''}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          width={item.w}
          height={item.h}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-90'} ${imgClassName}`}
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-800" />
      )}

      {isVid && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm shadow-md transition-transform duration-300 group-hover:scale-110">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
          </span>
        </span>
      )}
    </div>
  );
}

export function Lightbox({ items, index, onClose, onIndex }) {
  const item = items[index];
  const [full, setFull] = useState(false);
  const go = (d) => onIndex((index + d + items.length) % items.length);

  useEffect(() => setFull(false), [index]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  });
  // Preload the neighbours so next/previous opens instantly
  useEffect(() => {
    [1, -1].forEach((d) => { const n = items[(index + d + items.length) % items.length]; if (n?.image && !n.video) new Image().src = n.image; });
  }, [index, items]);

  if (!item) return null;
  const btn = 'grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <button className={`${btn} absolute right-4 top-4`} aria-label="Close"><CloseIcon width={24} height={24} /></button>
      {items.length > 1 && (
        <>
          <button className={`${btn} absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10`} aria-label="Previous" onClick={(e) => { e.stopPropagation(); go(-1); }}><ChevronLeft width={26} height={26} /></button>
          <button className={`${btn} absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10`} aria-label="Next" onClick={(e) => { e.stopPropagation(); go(1); }}><ChevronRight width={26} height={26} /></button>
        </>
      )}
      <figure className="flex max-h-full max-w-6xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
        {item.video ? (
          <video key={item.id} src={item.video} poster={item.image} controls autoPlay playsInline
            className="max-h-[80vh] max-w-full bg-black" />
        ) : (
        <div className="relative">
          {/* thumbnail shows instantly (already cached), full quality fades in over it */}
          {!full && item.thumb && <img src={item.thumb} alt="" className="max-h-[80vh] w-auto object-contain" />}
          <img
            key={item.id}
            src={item.image}
            alt={item.caption || ''}
            onLoad={() => setFull(true)}
            className={`max-h-[80vh] w-auto object-contain ${!full && item.thumb ? 'absolute inset-0 h-full w-full opacity-0' : ''}`}
          />
        </div>
        )}
        {(item.caption || item.category) && (
          <figcaption className="mt-4 text-center text-white">
            {item.caption && <span className="block text-lg sm:text-xl font-bold">{item.caption}</span>}
            {item.category && <span className="text-sm text-white/70">{item.category}</span>}
          </figcaption>
        )}
        {items.length > 1 && <p className="mt-2 text-xs text-white/50">{index + 1} / {items.length}</p>}
      </figure>
    </div>
  );
}

// Grid + lightbox: every asset displays in the exact same preview size
export default function PhotoGrid({ items, aspect = '4 / 3' }) {
  const [open, setOpen] = useState(null);
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5 md:gap-6">
        {items.map((it, i) => (
          <figure key={it.id} onClick={() => setOpen(i)}
            className="group cursor-zoom-in">
            <div className="overflow-hidden rounded-xl sm:rounded-2xl">
              <UploadedPhoto item={it} eager={i < 4} aspect={aspect}
                imgClassName="transition duration-700 group-hover:scale-105" />
            </div>
            {it.caption && (
              <figcaption className="px-1 pt-2 text-xs sm:text-sm md:text-base font-semibold text-ink line-clamp-1">
                {it.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      {open !== null && <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}
