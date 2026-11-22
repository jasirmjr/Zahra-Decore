const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const WhatsAppIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 21l1.65-4.8A8.5 8.5 0 1 1 7.9 19.4L3 21z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-2.3-2.3l.8-1-1-2L8.5 9" />
  </svg>
);
export const PhoneIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </svg>
);
export const MailIcon = (p) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3 6l9 7 9-7" /></svg>
);
export const PinIcon = (p) => (
  <svg {...base} {...p}><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
export const InstagramIcon = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></svg>
);
export const FacebookIcon = (p) => (
  <svg {...base} {...p}><path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z" /></svg>
);
export const ArrowIcon = (p) => (<svg {...base} strokeWidth={2.2} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const ShieldIcon = (p) => (<svg {...base} {...p}><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></svg>);
export const RulerIcon = (p) => (<svg {...base} {...p}><path d="M3 17L17 3l4 4L7 21l-4-4z" /><path d="M7 13l2 2M10 10l2 2M13 7l2 2" /></svg>);
export const ClockIcon = (p) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
export const TruckIcon = (p) => (<svg {...base} {...p}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>);
export const LeafIcon = (p) => (<svg {...base} {...p}><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" /><path d="M5 19l7-7" /></svg>);
export const ChatIcon = (p) => (<svg {...base} {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg>);
export const PencilIcon = (p) => (<svg {...base} {...p}><path d="M4 20h4L19 9l-4-4L4 16v4z" /><path d="M13 7l4 4" /></svg>);
export const HammerIcon = (p) => (<svg {...base} {...p}><path d="M14 6l4 4M3 21l9-9M11 4l5-1 5 5-1 5-4-1-5-5 0-3z" /></svg>);
export const HomeIcon = (p) => (<svg {...base} {...p}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></svg>);
export const SofaIcon = (p) => (<svg {...base} {...p}><path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" /><path d="M3 12a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3v-5z" /><path d="M5 17v2M19 17v2" /></svg>);

// White circle with arrow, used at the end of pill buttons
export const ArrowCircle = ({ dark }) => (
  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${dark ? 'bg-gold text-white' : 'bg-white text-gold'}`}>
    <ArrowIcon width={16} height={16} />
  </span>
);
export const MenuIcon =(p) => (<svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const CloseIcon = (p) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>);
