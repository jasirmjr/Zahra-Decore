# Zahra Decor website

React + Tailwind CSS frontend (`client/`) and a small Node/Express server (`server/`) that stores admin uploads.

## Run on your computer
```
npm run install:all   # first time only
npm run dev           # site: http://localhost:5173   admin: http://localhost:5173/admin
```

## Edit your details
`client/src/config.js` — phone, WhatsApp number, email, address, Google Maps link, Instagram, Facebook, categories.

## Website photos (fast loading)
1. Put the full-size photo in `image-originals/` (e.g. `image-originals/sofa-red.jpg`).
2. Run `npm run images` → creates small WebP versions in `client/public/images/`.
3. Use the name (`sofa-red`) in the code, e.g. in `client/src/config.js` categories.

Don't put big photos directly in `client/public` — they would be sent to visitors at full size.
Photos uploaded in the admin panel are optimized automatically (WebP, max 1920px).

## Admin password
`server/.env` → `ADMIN_PASSWORD=...` (change it before going live).

## Admin panel (/admin)
- **Products (Shop)**: image + name + category + price → shows on the home page; "Shop Now" opens WhatsApp with the order.
- **Works Gallery**: image + caption → shows on the Works page.
- **Hero Image**: replace the full-screen image on the home page.

## Go live
```
npm run build
npm start             # serves site + API on PORT (default 5000)
```
Host on any Node host with a persistent disk (VPS, Render with disk, Railway volume, Hostinger VPS…),
because uploaded images are saved in `server/uploads` and data in `server/data`.
