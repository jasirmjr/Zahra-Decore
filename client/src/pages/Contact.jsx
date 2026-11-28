import PageHeader from '../components/PageHeader';
import ContactButtons from '../components/ContactButtons';
import Photo from '../components/Photo';
import { SITE, waLink, mailLink, tel, PHONES } from '../config';
import { PhoneIcon, MailIcon, PinIcon, WhatsAppIcon, InstagramIcon, FacebookIcon, ArrowCircle } from '../components/Icons';

function Card({ icon, label, children, href, external, className = '' }) {
  const Tag = href ? 'a' : 'div'; // no href: a plain card that can hold several links
  return (
    <Tag href={href} target={external ? '_blank' : undefined} rel={href ? 'noreferrer' : undefined}
      className={`group flex items-center gap-4 rounded-3xl bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-xl ${className}`}>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-muted">{label}</span>
        <span className="block break-words font-bold">{children}</span>
      </span>
      {href && <span className="opacity-0 transition group-hover:opacity-100"><ArrowCircle dark /></span>}
    </Tag>
  );
}

export default function Contact() {
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&z=15&output=embed`;

  return (
    <>
      <PageHeader eyebrow="Contact" title="Contact Us"
        image="sofa-cushions"
        text="Visit our showroom, call us, or send a message on WhatsApp." />

      <section className="wrap grid gap-6 py-10 sm:py-12 md:py-14 lg:grid-cols-2 lg:gap-8">
        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
            <Card icon={<PhoneIcon />} label="Call us">
              {PHONES.map((p) => <a key={p} href={tel(p)} className="block py-0.5 hover:text-gold">{p}</a>)}
            </Card>
            <Card icon={<PhoneIcon />} label="Factory contact">
              {SITE.factoryPhones.map((p) => <a key={p} href={tel(p)} className="block py-0.5 hover:text-gold">{p}</a>)}
            </Card>
            <Card icon={<WhatsAppIcon />} label="WhatsApp" href={waLink()} external>Chat on WhatsApp</Card>
            <Card icon={<MailIcon />} label="Email" href={mailLink}>{SITE.email.split("@")[0]}<wbr />@{SITE.email.split("@")[1]}</Card>
            <Card icon={<PinIcon />} label="Visit showroom" href={SITE.mapLink} external className="sm:col-span-2 lg:col-span-1 2xl:col-span-2">{SITE.address}</Card>
          </div>

          <div className="mt-4 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-5">
            <p className="text-sm font-bold text-ink">Follow us</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              <a href={SITE.instagram} target="_blank" rel="noreferrer" className="btn-plain !py-2 !px-4 text-xs bg-cream hover:bg-gold hover:text-white"><InstagramIcon width={16} /> Instagram</a>
              <a href={SITE.facebook} target="_blank" rel="noreferrer" className="btn-plain !py-2 !px-4 text-xs bg-cream hover:bg-gold hover:text-white"><FacebookIcon width={16} /> Facebook</a>
            </div>
            <p className="mt-5 text-sm font-bold text-ink">Talk to us directly</p>
            <ContactButtons className="mt-3" />
          </div>
        </div>

        {/* Map – click anywhere to open Google Maps */}
        <a href={SITE.mapLink} target="_blank" rel="noreferrer" className="group relative block min-h-[300px] sm:min-h-[360px] md:min-h-[400px] overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-xs">
          {SITE.mapQuery ? (
            <iframe title="Zahra Decor location" src={embed} loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full" />
          ) : (
            <>
              <Photo src="dining-living" sizes="(min-width: 1024px) 50vw, 100vw" alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pb-20 text-center text-white">
                <span className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-xl bg-gold text-white"><PinIcon width={24} height={24} /></span>
                <h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl font-bold">Visit our showroom</h3>
                <p className="mt-1.5 max-w-xs text-xs sm:text-sm text-white/85">Tap to open our exact location and get directions in Google Maps.</p>
              </div>
            </>
          )}
          <span className="btn-gold absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-lg text-xs sm:text-sm">
            Open in Google Maps <ArrowCircle />
          </span>
        </a>
      </section>
    </>
  );
}
