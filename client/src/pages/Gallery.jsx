import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import PhotoGrid from '../components/PhotoGrid';
import { CtaBanner } from '../components/Sections';
import { api } from '../api';
import { CATEGORIES } from '../config';

// Gallery photos are uploaded in Admin -> "Gallery".
export default function Gallery() {
  const [photos, setPhotos] = useState(null);
  const [filter, setFilter] = useState('All');
  useEffect(() => { api('/gallery').then(setPhotos).catch(() => setPhotos([])); }, []);

  // Filter chips only for categories that actually have photos
  const used = useMemo(() => CATEGORIES.map((c) => c.name).filter((n) => photos?.some((p) => p.category === n)), [photos]);
  const shown = filter === 'All' ? photos : photos?.filter((p) => p.category === filter);

  return (
    <>
      <PageHeader eyebrow="Gallery" title="Our Gallery"
        image="living-grey"
        text="Photos of our sofas, cots, curtains, gypsum and wall works — all made and fitted by us." />

      <section className="wrap py-10 sm:py-14 md:py-16">
        {used.length > 1 && (
          <div className="mb-6 sm:mb-8 flex flex-wrap gap-2">
            {['All', ...used].map((c) => (
              <button key={c} onClick={() => setFilter(c)}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${filter === c ? 'bg-gold text-white' : 'bg-cream text-ink hover:bg-gold/15'}`}>
                {c}
              </button>
            ))}
          </div>
        )}

        {photos === null ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`mb-3 sm:mb-4 animate-pulse rounded-2xl sm:rounded-3xl bg-cream ${i % 3 ? 'aspect-[4/3]' : 'aspect-[3/4]'}`} />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <p className="py-10 text-center text-muted">New photos are coming soon.</p>
        ) : (
          <PhotoGrid key={filter} items={shown} />
        )}
      </section>

      <CtaBanner />
    </>
  );
}
