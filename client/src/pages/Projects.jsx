import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import PhotoGrid from '../components/PhotoGrid';
import { CtaBanner } from '../components/Sections';
import { api } from '../api';

// Project photos are managed in Admin -> "Projects" (stored under the "works" API name).
export default function Projects() {
  const [projects, setProjects] = useState(null);
  useEffect(() => { api('/works').then(setProjects).catch(() => setProjects([])); }, []);

  return (
    <>
      <PageHeader eyebrow="Projects" title="Our Projects"
        image="bedroom-light"
        text="A look at homes and spaces we have furnished." />

      <section className="wrap py-10 sm:py-14 md:py-16">
        <div className="mb-8 sm:mb-10">
          <h2 className="title mb-2 text-xl sm:text-2xl md:text-3xl">Our Works & Projects</h2>
          <p className="text-xs sm:text-sm md:text-base text-muted">
            Explore our furniture manufacturing process, custom furniture designs, and completed interior installations.
          </p>
        </div>

        {projects === null ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5 md:gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="animate-pulse rounded-xl sm:rounded-2xl bg-cream aspect-[4/3]" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <PhotoGrid items={projects} />
        ) : (
          <p className="py-12 text-center text-sm text-muted">No projects added yet.</p>
        )}
      </section>

      <CtaBanner />
    </>
  );
}
