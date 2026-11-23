# Zahra Decor website

React + Tailwind CSS frontend (`client/`) and a small Express API (`server/`) that stores admin uploads in Vercel Blob.

## Run on your computer
```
npm run install:all   # first time only
vercel env pull       # first time only: gets the Blob token into .env.local
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
Set `ADMIN_PASSWORD` in Vercel → Project → Settings → Environment Variables, then redeploy.

## Admin panel (/admin)
- **Products (Shop)**: image + name + category + price → shows on the home page; "Shop Now" opens WhatsApp with the order.
- **Works Gallery**: image + caption → shows on the Works page.
- **Hero Image**: replace the full-screen image on the home page.

Photos are shrunk to WebP in the browser and saved in Vercel Blob. The public site may take up to a minute to show changes.

## Go live (Vercel)
```
vercel deploy --prod   # deploys both services (client + server), see vercel.json
```
Live at https://zahra-decor.vercel.app
