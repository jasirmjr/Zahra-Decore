import Photo from './Photo';
import { SITE, waLink, telLink, mailLink } from '../config';
import { ChatIcon, PencilIcon, HammerIcon, HomeIcon, PhoneIcon, MailIcon, ArrowCircle, WhatsAppIcon } from './Icons';


export function SectionHead({ eyebrow, title, children, center }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="title mt-4">{title}</h2>
      {children && <p className={`mt-4 text-lg text-muted ${center ? 'mx-auto max-w-xl' : 'max-w-md'}`}>{children}</p>}
    </div>
  );
}

/* ---------- Process: heading left + 4 numbered cards ---------- */
const STEPS = [
  [ChatIcon, 'Consultation', 'Tell us your idea, space and budget — in store, on call or WhatsApp.'],
  [PencilIcon, 'Design & Measure', 'We suggest designs, fabrics and finishes and take exact measurements.'],
  [HammerIcon, 'Manufacturing', 'Your furniture is built in our own workshop by skilled craftsmen.'],
  [HomeIcon, 'Delivery & Fitting', 'We deliver and install everything neatly in your home.'],
];

export function Process() {
  return (
    <section className="w-full py-20">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_2.6fr]">
        <SectionHead eyebrow="How we work" title="Simple process, from idea to your home" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([Icon, t, d], i) => (
            <div key={t} className="rounded-3xl bg-card p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold"><Icon /></span>
                <span className="text-3xl font-bold text-gold/40">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA card: text left, photo right, floating contact cards ---------- */
export function CtaBanner() {
  return (
    <section className="relative grid w-full overflow-hidden bg-white lg:grid-cols-2">
      <div className="contents">
        <div className="relative z-10 px-4 py-14 md:px-8 md:py-20 xl:pl-[max(3rem,calc((100vw-1600px)/2+3rem))]">
          <p className="eyebrow">Ready to start?</p>
          <h2 className="title mt-4">Let's create your dream interior</h2>
          <p className="mt-4 max-w-md text-lg text-muted">
            Send us a photo or idea — we'll share designs, prices and make it to your exact size.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={waLink()} target="_blank" rel="noreferrer" className="btn bg-[#25D366] text-white hover:opacity-90">
              <WhatsAppIcon width={18} /> WhatsApp Us <ArrowCircle />
            </a>
            <a href={telLink} className="btn-outline">Call Now <ArrowCircle dark /></a>
          </div>
        </div>
        <div className="relative min-h-[340px]">
          <Photo src="dining-living" sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute right-5 top-1/2 flex -translate-y-1/2 flex-col gap-3 md:right-10">
            <a href={telLink} className="flex items-center gap-3 rounded-2xl bg-white/95 p-4 pr-6 shadow-lg backdrop-blur transition hover:scale-[1.02]">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/15 text-gold"><PhoneIcon /></span>
              <span><span className="block font-bold">{SITE.phone}</span><span className="text-xs text-muted">Call us anytime</span></span>
            </a>
            <a href={mailLink} className="flex items-center gap-3 rounded-2xl bg-white/95 p-4 pr-6 shadow-lg backdrop-blur transition hover:scale-[1.02]">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/15 text-gold"><MailIcon /></span>
              <span><span className="block font-bold">{SITE.email}</span><span className="text-xs text-muted">Reply within a day</span></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
