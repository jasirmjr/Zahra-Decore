import { waLink, telLink, mailLink } from '../config';
import { WhatsAppIcon, PhoneIcon, MailIcon } from './Icons';

export default function ContactButtons({ className = '' }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={waLink()} target="_blank" rel="noreferrer" className="btn-plain bg-[#25D366] text-white hover:opacity-90">
        <WhatsAppIcon width={18} /> WhatsApp
      </a>
      <a href={telLink} className="btn-plain bg-gold text-white hover:bg-gold-dark"><PhoneIcon width={18} /> Call Now</a>
      <a href={mailLink} className="btn-plain bg-white text-ink ring-2 ring-ink/10 hover:text-gold hover:ring-gold"><MailIcon width={18} /> Email Us</a>
    </div>
  );
}
