import { waLink } from '../config';
import { WhatsAppIcon } from './Icons';

export default function FloatingWhatsApp() {
  return (
    <a href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
       className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105">
      <WhatsAppIcon width={28} height={28} />
    </a>
  );
}
