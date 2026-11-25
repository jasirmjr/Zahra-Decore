// Local development: runs the API (server/index.js) on http://localhost:5000; Vite proxies /api to it.
// Needs BLOB_READ_WRITE_TOKEN (+ ADMIN_PASSWORD) in the repo-root .env.local (get them with `vercel env pull`).
// Alternatively run `vercel dev` from the repo root, which runs both services together.
import app from './index.js';

// The website is served by Vite, not this API — send stray browser visits there.
const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';
app.get(/^\/(?!api\/).*/, (req, res) => res.redirect(SITE_URL + req.originalUrl));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Zahra Decor API on http://localhost:${PORT}`));
