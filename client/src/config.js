// ============================================================
//  EDIT YOUR BUSINESS DETAILS HERE – used across the whole site
// ============================================================
export const SITE = {
  name: 'Zahra Decor',
  tagline: 'Curtain & Furniture',

  // Phone shown on the site + used for "Call" buttons
  phone: '+91 95679 39608',
  // Extra call number (shown under the main one wherever "Call us" numbers are listed)
  phone2: '+91 90727 37943',
  // WhatsApp number: country code + number, digits only (no + or spaces)
  whatsapp: '919567939608',
  email: 'zahradecor123@gmail.com',

  // Shown as text on the site (footer + contact page)
  address: 'View our showroom on Google Maps',
  // Your Google Maps share link – every address/map click opens this exact location
  mapLink: 'https://maps.app.goo.gl/33STGdaGoptjzwZi7',
  // Map preview on the Contact page: put the shop's full address or "lat,lng" here.
  // Leave empty to show a photo card with an "Open in Google Maps" button instead.
  mapQuery: '11.0046617,75.979915',

  instagram: 'https://instagram.com/zahradecor',
  facebook: 'https://facebook.com/zahradecor',
};

// Product categories shown on the landing page (admin picks one per product)
export const CATEGORIES = [
  { name: 'Metal Cots', image: 'bed-woven' },
  { name: 'Premium Sofas', image: 'sofa-brown' },
  { name: 'Curtains & Blinds', image: 'bedroom-curtains' },
  { name: 'Dining Tables & Metal Chairs', image: 'dining-living' },
  { name: 'Home Decor Items', image: 'living-grey' },
  { name: 'Gypsum & Wall Works', image: 'bedroom-light' },
];
// Images are names of files in client/public/images (made by "npm run images" from /image-originals)

export const DEFAULT_HERO = 'living-lsofa';

export const waLink = (text = `Hello ${SITE.name}, I would like to know more.`) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
export const tel = (n) => `tel:${n.replace(/\s/g, '')}`;
export const telLink = tel(SITE.phone);
// All call numbers, main one first
export const PHONES = [SITE.phone, SITE.phone2].filter(Boolean);
export const mailLink = `mailto:${SITE.email}`;
