import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { CloseIcon } from '../components/Icons';
import { CtaBanner } from '../components/Sections';
import { api } from '../api';

export default function Works() {
  const [works, setWorks] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => { api('/works').then(setWorks).catch(() => setWorks([])); }, []);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <PageHeader eyebrow="Works" title="Our Works"
        image="bedroom-light"
        text="A look at homes and spaces we have furnished." />

      <section className="wrap py-10 sm:py-14 md:py-16">
        {/* Featured Project Videos */}
        <div className="mb-10 sm:mb-12">
          <h2 className="title mb-2 text-xl sm:text-2xl md:text-3xl">Project Videos</h2>
          <p className="mb-6 text-xs sm:text-sm md:text-base text-muted">Watch our furniture manufacturing process and completed interior projects.</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            <div className="group overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-4 shadow-sm transition hover:shadow-xl">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl bg-black">
                <video controls playsInline preload="metadata" poster="/work-video-1-poster.jpg" className="h-full w-full object-cover">
                  <source src="/work-video-1.mp4" type="video/mp4" />
                </video>
              </div>
              <h3 className="mt-3 px-1 text-base sm:text-lg font-bold text-ink">In-House Manufacturing</h3>
              <p className="px-1 text-xs sm:text-sm text-muted">Skilled craftsmen building custom furniture in our workshop</p>
            </div>
            <div className="group overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-4 shadow-sm transition hover:shadow-xl">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl bg-black">
                <video controls playsInline preload="metadata" poster="/work-video-2-poster.jpg" className="h-full w-full object-cover">
                  <source src="/work-video-2.mp4" type="video/mp4" />
                </video>
              </div>
              <h3 className="mt-3 px-1 text-base sm:text-lg font-bold text-ink">Completed Interior Installation</h3>
              <p className="px-1 text-xs sm:text-sm text-muted">Curtains, beds & custom living room furniture ready to live in</p>
            </div>
          </div>
        </div>

        {works === null ? (
          <p className="text-center text-muted">Loading…</p>
        ) : works.length === 0 ? null : (
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4">
            {works.map((w) => (
              <figure key={w.id} className="group mb-5 cursor-zoom-in break-inside-avoid rounded-3xl bg-white p-3 transition hover:shadow-xl" onClick={() => setOpen(w)}>
                <div className="overflow-hidden rounded-2xl">
                  <img src={w.image} alt={w.caption} loading="lazy" className="w-full transition duration-700 group-hover:scale-105" />
                </div>
                {w.caption && <figcaption className="px-2 pb-1 pt-3 text-lg font-bold">{w.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </section>

      <CtaBanner />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setOpen(null)}>
          <button className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white" aria-label="Close"><CloseIcon width={26} height={26} /></button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={open.image} alt={open.caption} className="max-h-[80vh] w-auto object-contain" />
            {open.caption && <figcaption className="mt-4 text-center text-xl font-bold text-white">{open.caption}</figcaption>}
          </figure>
        </div>
      )}
    </>
  );
}
