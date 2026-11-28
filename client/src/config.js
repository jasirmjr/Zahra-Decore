// ============================================================
//  EDIT YOUR BUSINESS DETAILS HERE – used across the whole site
// ============================================================
export const SITE = {
  name: 'Zahra Decor',
  tagline: 'Curtain & Furniture',

  // Phone shown on the site + used for "Call" buttons
  phone: '+91 95679 39608',
  // Factory numbers (shown as "Factory contact" on the Contact page)
  factoryPhones: ['+91 95396 46564', '+91 90727 37943', '+91 95679 39608'],
  // WhatsApp number: country code + number, digits only (no + or spaces)
  whatsapp: '919567939608',
  // WhatsApp number for "Shop by category" enquiries only
  whatsappShop: '919072737943',
  email: 'zahradecor123@gmail.com',

  // Shown as text on the site (footer + contact page)
  address: 'View our showroom on Google Maps',
  // Your Google Maps share link – every address/map click opens this exact location
  mapLink: 'https://maps.app.goo.gl/33STGdaGoptjzwZi7',
  // Map preview on the Contact page: put the shop's full address or "lat,lng" here.
  // Leave empty to show a photo card with an "Open in Google Maps" button instead.
  mapQuery: '11.0046617,75.979915',

  instagram: 'https://www.instagram.com/zahra_decor_interior/',
  facebook: 'https://www.facebook.com/share/1DuGJABnqs/',
};

// Product categories / services shown on the landing page (admin picks one per product)
// Cover photos come from client/public/services, optimized into client/public/images as "svc-..."
export const CATEGORIES = [
  { name: 'Metal Cots', image: 'svc-metal-cots' },
  { name: 'Premium Sofas', image: 'svc-premium-sofas' },
  { name: 'Curtains & Blinds', image: 'svc-curtains-blinds' },
  { name: 'Dining Tables & Metal Chairs', image: 'svc-dining-tables' },
  { name: 'Home Decor Items', image: 'svc-home-decor' },
  { name: 'Gypsum & Wall Works', image: 'svc-gypsum-wall' },
  { name: 'Cupboard Works', image: 'svc-cupboard-works' },
  { name: 'Modular Kitchen', image: 'svc-modular-kitchen' },
  { name: 'Wall Panels', image: 'svc-wall-panels' },
];
// Images are names of files in client/public/images (made by "npm run images" from /image-originals)

// Landing page background slideshow: one photo per service
export const HERO_SLIDES = CATEGORIES.map((c) => c.image);
export const HERO_INTERVAL = 5000; // ms each slide stays on screen

export const DEFAULT_HERO = 'living-lsofa';

export const waLink = (text = `Hello ${SITE.name}, I would like to know more.`, number = SITE.whatsapp) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
export const tel = (n) => `tel:${n.replace(/\s/g, '')}`;
export const telLink = tel(SITE.phone);
// Numbers listed wherever "Call us" appears
export const PHONES = [SITE.phone];
export const mailLink = `mailto:${SITE.email}`;
