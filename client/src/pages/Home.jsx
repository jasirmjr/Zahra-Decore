import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { CATEGORIES, DEFAULT_HERO, SITE, waLink } from '../config';
import { WhatsAppIcon, ArrowCircle, ShieldIcon, RulerIcon, ClockIcon } from '../components/Icons';
import Photo from '../components/Photo';
import AboutContent from '../components/AboutContent';
import { SectionHead, Process, CtaBanner } from '../components/Sections';

const STATS = [
  [ShieldIcon, '100% In-house', 'own manufacturing'],
  [RulerIcon, 'Custom Sizes', 'made to your design'],
  [ClockIcon, 'Free Visit', 'measurement at home'],
];

export default function Home() {
  const [hero, setHero] = useState(null);
  const [works, setWorks] = useState([]);

  useEffect(() => {
    api('/settings').then((s) => setHero(s.heroImage || DEFAULT_HERO)).catch(() => setHero(DEFAULT_HERO));
    api('/works').then(setWorks).catch(() => {});
  }, []);

  const coverFor = (cat) => cat.image;

  return (
    <>
      {/* ================= HERO: Full-size background banner ================= */}
      <section className="relative mt-20 h-[calc(100svh-5rem)] min-h-[620px] w-full overflow-hidden">
        {hero && (
          <Photo
            src={hero}
            priority
            alt="Zahra Decor interior"
            className="animate-hero absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />

        <div className="wrap relative flex h-full flex-col justify-center pb-28 text-white">
          <h1 className="fade-up mt-5 max-w-4xl text-4xl leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-bold" style={{ animationDelay: '.1s' }}>
            Beautiful furniture, <span className="text-gold-light">made for your home</span>
          </h1>
          <p className="fade-up mt-6 max-w-lg text-lg text-white/90" style={{ animationDelay: '.2s' }}>
            Sofas, beds, curtains, dining sets, wardrobes and custom furniture designed and manufactured in our own workshop.
          </p>
          <div className="fade-up mt-9 flex flex-wrap items-center gap-4" style={{ animationDelay: '.3s' }}>
            <a
              href={waLink(`Hello ${SITE.name}, I would like to enquire about furniture and custom interior works.`)}
              target="_blank"
              rel="noreferrer"
              className="btn bg-white text-ink shadow-lg transition hover:bg-gold hover:text-white"
            >
              <WhatsAppIcon width={18} className="text-[#25D366]" /> Enquire on WhatsApp <ArrowCircle dark />
            </a>
            <a
              href="#shop"
              className="btn bg-white text-ink shadow-lg transition hover:bg-gold hover:text-white"
            >
              Our Collections <ArrowCircle dark />
            </a>
          </div>
        </div>

        {/* floating stat cards */}
        <div className="absolute inset-x-0 bottom-6">
          <div className="wrap">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:ml-auto lg:max-w-2xl">
              {STATS.map(([Icon, t, d]) => (
                <div key={t} className="flex items-center gap-3 rounded-2xl bg-white/95 p-3.5 shadow-lg backdrop-blur md:p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
                    <Icon width={18} />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-bold text-ink md:text-base">{t}</span>
                    <span className="text-xs text-muted">{d}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT / WHY US ================= */}
      <AboutContent />

      {/* ================= SHOP BY CATEGORY ================= */}
      <section id="shop" className="w-full scroll-mt-24 py-20">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Our Collections" title="Shop by category" />
            <p className="max-w-sm text-muted">Pick a category to see our designs, then enquire directly on WhatsApp.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.name}
                href={waLink(`Hello ${SITE.name}, I would like to enquire about ${cat.name}. Please share designs and prices.`)}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl text-left shadow-sm transition hover:shadow-xl"
              >
                <Photo src={coverFor(cat)} alt={cat.name} sizes="(min-width: 1024px) 33vw, 50vw"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-xl bg-white/95 p-3 pl-4 shadow-md backdrop-blur md:inset-x-4 md:bottom-4">
                  <span>
                    <span className="block font-bold leading-tight md:text-lg text-ink">{cat.name}</span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gold">
                      <WhatsAppIcon width={14} /> Enquire on WhatsApp
                    </span>
                  </span>
                  <span className="transition group-hover:translate-x-0.5"><ArrowCircle dark /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SHOWCASE WORKS (VIDEOS) ================= */}
      <section className="w-full scroll-mt-24 bg-white py-20">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Our Works" title="Craftsmanship in motion">
              Take a look inside our workshop and see our finished interior installations in real homes.
            </SectionHead>
            <Link to="/works" className="btn-gold">
              See All Works <ArrowCircle />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Video 1 */}
            <div className="group overflow-hidden rounded-3xl bg-cream p-4 shadow-sm transition hover:shadow-xl">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-inner">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster="/work-video-1-poster.jpg"
                  className="h-full w-full object-cover"
                >
                  <source src="/work-video-1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1 pt-4">
                <div>
                  <h3 className="text-lg font-bold text-ink">In-House Manufacturing</h3>
                  <p className="text-sm text-muted">Skilled craftsmen building custom furniture in our workshop</p>
                </div>
                <Link to="/works" className="btn-outline shrink-0 !py-2 !px-4 text-xs">
                  See Works <ArrowCircle dark />
                </Link>
              </div>
            </div>

            {/* Video 2 */}
            <div className="group overflow-hidden rounded-3xl bg-cream p-4 shadow-sm transition hover:shadow-xl">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-inner">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster="/work-video-2-poster.jpg"
                  className="h-full w-full object-cover"
                >
                  <source src="/work-video-2.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1 pt-4">
                <div>
                  <h3 className="text-lg font-bold text-ink">Completed Interior Installation</h3>
                  <p className="text-sm text-muted">Curtains, beds & custom living room furniture ready to live in</p>
                </div>
                <Link to="/works" className="btn-outline shrink-0 !py-2 !px-4 text-xs">
                  See Works <ArrowCircle dark />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RECENT WORKS ================= */}
      {works.length > 0 && (
        <section className="w-full py-20">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead eyebrow="Our Works" title="Interiors brought to life" />
              <Link to="/works" className="btn-outline">All Works <ArrowCircle dark /></Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {works.slice(0, 3).map((w) => (
                <Link to="/works" key={w.id} className="group rounded-3xl bg-white p-3 transition hover:shadow-xl">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                    <img src={w.image} alt={w.caption} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-4">
                    <h3 className="text-lg">{w.caption || 'Our project'}</h3>
                    <ArrowCircle dark />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= PROCESS + CTA ================= */}
      <Process />
      <CtaBanner />
    </>
  );
}
