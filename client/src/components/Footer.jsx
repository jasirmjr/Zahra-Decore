import { Link } from 'react-router-dom';
import { SITE, waLink, telLink, mailLink } from '../config';
import { WhatsAppIcon, PhoneIcon, MailIcon, InstagramIcon, FacebookIcon, PinIcon } from './Icons';

const social = 'grid h-11 w-11 place-items-center bg-cream text-ink transition hover:bg-gold hover:text-white';

export default function Footer() {
  return (
    <footer className="w-full border-t border-black/5 bg-white">
      <div className="wrap grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.4fr_1fr]">
        <div>
          <img src="/logo.webp" alt="Zahra Decor" className="h-28 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-muted">
            Interior products & custom furniture — designed and manufactured by us.
          </p>
        </div>
        <div>
          <h4 className="mb-5 text-lg">Navigation</h4>
          <ul className="space-y-2.5 text-sm font-medium text-muted">
            {[['/', 'Home'], ['/about', 'About Us'], ['/services', 'Services'], ['/works', 'Works'], ['/contact', 'Contact']].map(([to, l]) => (
              <li key={to}><Link to={to} className="hover:text-gold">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-5 text-lg">Contact</h4>
          <ul className="space-y-3 text-sm font-medium text-muted">
            <li><a href={telLink} className="flex items-center gap-3 hover:text-gold"><PhoneIcon width={16} className="text-gold" />{SITE.phone}</a></li>
            <li><a href={waLink()} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-gold"><WhatsAppIcon width={16} className="text-gold" />Chat on WhatsApp</a></li>
            <li><a href={mailLink} className="flex items-center gap-3 break-all hover:text-gold"><MailIcon width={16} className="shrink-0 text-gold" />{SITE.email}</a></li>
            <li><a href={SITE.mapLink} target="_blank" rel="noreferrer" className="flex items-start gap-3 hover:text-gold"><PinIcon width={16} className="mt-0.5 shrink-0 text-gold" />{SITE.address}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-5 text-lg">Follow us</h4>
          <div className="flex gap-3">
            <a href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className={social}><InstagramIcon /></a>
            <a href={SITE.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className={social}><FacebookIcon /></a>
            <a href={waLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp" className={social}><WhatsAppIcon /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-black/5 bg-ink py-5 text-center text-sm text-white/70">
        © {new Date().getFullYear()} {SITE.name} · Curtain & Furniture. All rights reserved.
      </div>
    </footer>
  );
}
