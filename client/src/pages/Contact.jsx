import PageHeader from '../components/PageHeader';
import ContactButtons from '../components/ContactButtons';
import Photo from '../components/Photo';
import { SITE, waLink, telLink, mailLink } from '../config';
import { PhoneIcon, MailIcon, PinIcon, WhatsAppIcon, InstagramIcon, FacebookIcon, ArrowCircle } from '../components/Icons';

function Card({ icon, label, children, href, external }) {
  return (
    <a href={href} target={external ? '_blank' : undefined} rel="noreferrer"
      className="group flex items-center gap-4 rounded-3xl bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-xl">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-muted">{label}</span>
        <span className="block break-words font-bold">{children}</span>
      </span>
      <span className="opacity-0 transition group-hover:opacity-100"><ArrowCircle dark /></span>
    </a>
  );
}

export default function Contact() {
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&z=15&output=embed`;

  return (
    <>
      <PageHeader eyebrow="Contact" title="Contact Us"
        image="sofa-cushions"
        text="Visit our showroom, call us, or send a message on WhatsApp." />

      <section className="wrap grid gap-6 py-16 lg:grid-cols-2">
        <div className="space-y-4">
          <Card icon={<PhoneIcon />} label="Call us" href={telLink}>{SITE.phone}</Card>
          <Card icon={<WhatsAppIcon />} label="WhatsApp" href={waLink()} external>Chat with us on WhatsApp</Card>
          <Card icon={<MailIcon />} label="Email" href={mailLink}>{SITE.email}</Card>
          <Card icon={<PinIcon />} label="Visit our showroom" href={SITE.mapLink} external>{SITE.address}</Card>

          <div className="rounded-3xl bg-white p-6">
            <p className="font-bold">Follow us</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={SITE.instagram} target="_blank" rel="noreferrer" className="btn-plain bg-cream hover:bg-gold hover:text-white"><InstagramIcon width={18} /> Instagram</a>
              <a href={SITE.facebook} target="_blank" rel="noreferrer" className="btn-plain bg-cream hover:bg-gold hover:text-white"><FacebookIcon width={18} /> Facebook</a>
            </div>
            <p className="mt-6 font-bold">Talk to us directly</p>
            <ContactButtons className="mt-4" />
          </div>
        </div>

        {/* Map – click anywhere to open Google Maps */}
        <a href={SITE.mapLink} target="_blank" rel="noreferrer" className="group relative block min-h-[420px] overflow-hidden bg-white">
          {SITE.mapQuery ? (
            <iframe title="Zahra Decor location" src={embed} loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full" />
          ) : (
            <>
              <Photo src="dining-living" sizes="(min-width: 1024px) 50vw, 100vw" alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pb-24 text-center text-white">
                <span className="grid h-16 w-16 place-items-center bg-gold text-white"><PinIcon width={30} height={30} /></span>
                <h3 className="mt-5 text-3xl">Visit our showroom</h3>
                <p className="mt-2 max-w-xs text-white/85">Tap to open our exact location and get directions in Google Maps.</p>
              </div>
            </>
          )}
          <span className="btn-gold absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-lg">
            Open in Google Maps <ArrowCircle />
          </span>
        </a>
      </section>
    </>
  );
}
