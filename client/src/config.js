// ============================================================
//  EDIT YOUR BUSINESS DETAILS HERE – used across the whole site
// ============================================================
export const SITE = {
  name: 'Zahra Decor',
  tagline: 'Curtain & Furniture',

  // Phone shown on the site + used for "Call" buttons
  phone: '+91 95679 39608',
  // WhatsApp number: country code + number, digits only (no + or spaces)
  whatsapp: '919567939608',
  email: 'zahradecor123@gmail.com',

  // Shown as text on the site (footer + contact page)
  address: 'View our showroom on Google Maps',
  // Your Google Maps share link – every address/map click opens this exact location
  mapLink: 'https://maps.app.goo.gl/4ZC2MCEniFxFvRL9A',
  // Map preview on the Contact page: put the shop's full address or "lat,lng" here.
  // Leave empty to show a photo card with an "Open in Google Maps" button instead.
  mapQuery: '',

  instagram: 'https://instagram.com/zahradecor',
  facebook: 'https://facebook.com/zahradecor',
};

// Product categories shown on the landing page (admin picks one per product)
export const CATEGORIES = [
  { name: 'Sofas', image: 'sofa-brown' },
  { name: 'Beds & Cots', image: 'bed-woven' },
  { name: 'Curtains', image: 'bedroom-curtains' },
  { name: 'Dining Sets', image: 'dining-living' },
  { name: 'Wardrobes', image: 'bedroom-warm' },
  { name: 'Custom Furniture', image: 'sofa-grey-blinds' },
];
// Images are names of files in client/public/images (made by "npm run images" from /image-originals)

export const DEFAULT_HERO = 'living-lsofa';

export const waLink = (text = `Hello ${SITE.name}, I would like to know more.`) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
export const telLink = `tel:${SITE.phone.replace(/\s/g, '')}`;
export const mailLink = `mailto:${SITE.email}`;
