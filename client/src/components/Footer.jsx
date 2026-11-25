import { Link } from 'react-router-dom';
import { SITE, waLink, mailLink, tel, PHONES } from '../config';
import { WhatsAppIcon, PhoneIcon, MailIcon, InstagramIcon, FacebookIcon, PinIcon } from './Icons';

const social = 'grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg bg-cream text-ink transition hover:bg-gold hover:text-white';

export default function Footer() {
  return (
    <footer className="w-full border-t border-black/5 bg-white">
      <div className="wrap grid gap-8 py-10 sm:py-12 md:py-14 grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.3fr_1fr_1.4fr_1fr]">
        <div className="col-span-2 sm:col-span-1">
          <img src="/logo.webp" alt="Zahra Decor" className="h-20 sm:h-24 md:h-28 w-auto object-contain" />
          <p className="mt-3 max-w-xs text-xs sm:text-sm text-muted">
            Interior products & custom furniture — designed and manufactured by us.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm sm:text-base font-bold text-ink">Navigation</h4>
          <ul className="space-y-0.5 text-sm font-medium text-muted">
            {[['/', 'Home'], ['/about', 'About Us'], ['/services', 'Services'], ['/projects', 'Projects'], ['/gallery', 'Gallery'], ['/contact', 'Contact']].map(([to, l]) => (
              <li key={to}><Link to={to} className="inline-block py-1.5 hover:text-gold">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm sm:text-base font-bold text-ink">Contact</h4>
          <ul className="space-y-0.5 text-sm font-medium text-muted">
            {PHONES.map((p) => (
              <li key={p}><a href={tel(p)} className="flex items-center gap-2 py-1.5 hover:text-gold"><PhoneIcon width={14} className="text-gold shrink-0" />{p}</a></li>
            ))}
            <li><a href={waLink()} target="_blank" rel="noreferrer" className="flex items-center gap-2 py-1.5 hover:text-gold"><WhatsAppIcon width={14} className="text-gold shrink-0" />Chat on WhatsApp</a></li>
            <li><a href={mailLink} className="flex items-center gap-2 py-1.5 break-words hover:text-gold"><MailIcon width={14} className="shrink-0 text-gold" /><span className="min-w-0">{SITE.email.split("@")[0]}<wbr />@{SITE.email.split("@")[1]}</span></a></li>
            <li><a href={SITE.mapLink} target="_blank" rel="noreferrer" className="flex items-start gap-2 py-1.5 hover:text-gold"><PinIcon width={14} className="mt-0.5 shrink-0 text-gold" />{SITE.address}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm sm:text-base font-bold text-ink">Follow us</h4>
          <div className="flex gap-2.5">
            <a href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className={social}><InstagramIcon width={16} /></a>
            <a href={SITE.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className={social}><FacebookIcon width={16} /></a>
            <a href={waLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp" className={social}><WhatsAppIcon width={16} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-black/5 bg-ink px-4 py-4 text-center text-xs text-white/70">
        © {new Date().getFullYear()} {SITE.name} · Curtain & Furniture. All rights reserved.
      </div>
    </footer>
  );
}
