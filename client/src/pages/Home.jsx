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
      <section className="relative mt-16 sm:mt-18 md:mt-20 min-h-[500px] sm:min-h-[560px] md:min-h-[600px] lg:h-[calc(100svh-5rem)] w-full overflow-hidden">
        {hero && (
          <Photo
            src={hero}
            priority
            alt="Zahra Decor interior"
            className="animate-hero absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />

        <div className="wrap relative flex h-full flex-col justify-center pt-8 pb-24 sm:pb-28 text-white">
          <h1 className="fade-up max-w-4xl text-3xl leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl font-bold" style={{ animationDelay: '.1s' }}>
            Beautiful furniture, <span className="text-gold-light">made for your home</span>
          </h1>
          <p className="fade-up mt-3 sm:mt-5 max-w-xl text-sm sm:text-base md:text-lg text-white/90" style={{ animationDelay: '.2s' }}>
            Metal cots, premium sofas, curtains, dining tables and every home decor item — plus gypsum and wallpaper works — customised to your needs.
          </p>
          <div className="fade-up mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4" style={{ animationDelay: '.3s' }}>
            <a
              href={waLink(`Hello ${SITE.name}, I would like to enquire about furniture and custom interior works.`)}
              target="_blank"
              rel="noreferrer"
              className="btn bg-white text-ink shadow-lg transition hover:bg-gold hover:text-white"
            >
              <WhatsAppIcon width={18} className="text-[#25D366]" /> Enquire on WhatsApp <ArrowCircle dark />
            </a>
            
          </div>
        </div>

        {/* floating stat cards */}
        <div className="absolute inset-x-0 bottom-4 sm:bottom-6">
          <div className="wrap">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:ml-auto lg:mr-16 lg:max-w-3xl">
              {STATS.map(([Icon, t, d]) => (
                <div key={t} className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-1.5 sm:gap-3 rounded-xl sm:rounded-2xl bg-white/95 p-2 sm:p-3 md:p-3.5 shadow-lg backdrop-blur">
                  <span className="grid h-8 w-8 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-lg sm:rounded-xl bg-gold/15 text-gold">
                    <Icon width={16} />
                  </span>
                  <span className="leading-tight min-w-0">
                    <span className="block text-xs sm:text-sm font-bold text-ink md:text-base">{t}</span>
                    <span className="hidden sm:block text-[11px] text-muted md:text-xs">{d}</span>
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
      <section id="shop" className="w-full scroll-mt-20 py-10 sm:py-14 md:py-16">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow="Our Collections" title="Shop by category" />
            <p className="max-w-sm text-xs sm:text-sm text-muted">Pick a category to see our designs, then enquire directly on WhatsApp.</p>
          </div>

          <div className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 md:gap-5">
            {CATEGORIES.map((cat, i) => (
              <a
                key={cat.name}
                href={waLink(`Hello ${SITE.name}, I would like to enquire about ${cat.name}. Please share designs and prices.`)}
                target="_blank"
                rel="noreferrer"
                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl text-left shadow-xs transition hover:shadow-xl ${
                  // an odd last card fills the rest of its row instead of leaving a gap
                  i === CATEGORIES.length - 1 && CATEGORIES.length % 2 ? 'col-span-2 aspect-[8/3] md:aspect-auto' : 'aspect-[4/3]'
                }`}
              >
                <Photo src={coverFor(cat)} alt={cat.name} sizes="(min-width: 1024px) 33vw, 50vw"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1.5 rounded-lg bg-white/95 p-2 sm:inset-x-3 sm:bottom-3 sm:rounded-xl sm:p-3 md:inset-x-4 md:bottom-4 md:pl-4 shadow-md backdrop-blur">
                  <span className="min-w-0">
                    <span className="block font-bold leading-tight text-ink text-[13px] sm:text-base md:text-lg">{cat.name}</span>
                    <span className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-gold">
                      <WhatsAppIcon width={12} className="shrink-0" />
                      <span className="hidden sm:inline">Enquire on WhatsApp</span>
                      <span className="sm:hidden">Enquire</span>
                    </span>
                  </span>
                  <span className="shrink-0 transition group-hover:translate-x-0.5"><ArrowCircle dark /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SHOWCASE WORKS (VIDEOS) ================= */}
      <section className="w-full scroll-mt-20 bg-white py-10 sm:py-14 md:py-16">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow="Our Works" title="Craftsmanship in motion">
              Take a look inside our workshop and see our finished interior installations in real homes.
            </SectionHead>
            <Link to="/works" className="btn-gold">
              See All Works <ArrowCircle />
            </Link>
          </div>

          <div className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/work-video-1-poster.jpg"
              className="aspect-video w-full object-cover"
            >
              <source src="/work-video-1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <video
              controls
              playsInline
              preload="metadata"
              poster="/work-video-2-poster.jpg"
              className="aspect-video w-full object-cover"
            >
              <source src="/work-video-2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
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
