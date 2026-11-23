import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getToken, setToken } from '../api';
import { CATEGORIES, DEFAULT_HERO } from '../config';

/* ---------------- Login ---------------- */
function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await api('/login', { method: 'POST', body: { password } });
      setToken(token);
      onLogin();
    } catch (err) { setError(err.message); }
  };
  return (
    <div className="grid min-h-screen place-items-center bg-neutral-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-8 shadow-sm">
        <img src="/logo.webp" alt="Zahra Decor" className="mx-auto h-24" />
        <h1 className="mt-4 text-center font-serif text-2xl">Admin Panel</h1>
        <input type="password" className="input mt-6" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} autoFocus />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button className="btn-gold mt-4 w-full">Login</button>
      </form>
    </div>
  );
}

/* ---------------- Image picker with preview ---------------- */
function ImagePicker({ file, setFile }) {
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return (
    <label className="flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-500 hover:border-gold">
      {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : 'Click to choose image from device'}
      <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files[0] || null)} />
    </label>
  );
}

/* ---------------- Generic collection manager ---------------- */
function Manager({ endpoint, fields, title, onAuthError }) {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => api(`/${endpoint}`, { fresh: true }).then(setItems);
  useEffect(() => { load(); setForm({}); setFile(null); setMsg(''); }, [endpoint]);

  const handle = async (fn) => {
    try { await fn(); } catch (e) { if (e.status === 401) onAuthError(); else setMsg(e.message); }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!file) return setMsg('Please choose an image');
    const missing = fields.find((f) => f.required && !form[f.name]);
    if (missing) return setMsg(`Please fill ${missing.label}`);
    setBusy(true);
    handle(async () => {
      const fd = new FormData();
      fd.append('image', file);
      fields.forEach((f) => fd.append(f.name, form[f.name] || ''));
      await api(`/${endpoint}`, { method: 'POST', body: fd, auth: true });
      setFile(null); setForm({}); setMsg('Uploaded ✓');
      await load();
    }).finally(() => setBusy(false));
  };

  const remove = (id) => {
    if (!confirm('Delete this item?')) return;
    handle(async () => { await api(`/${endpoint}/${id}`, { method: 'DELETE', auth: true }); await load(); });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="h-fit space-y-4 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl">Add {title}</h2>
        <ImagePicker file={file} setFile={setFile} />
        {fields.map((f) => (
          <div key={f.name}>
            <label className="mb-1 block text-xs tracking-wider uppercase text-neutral-500">{f.label}</label>
            {f.options ? (
              <select className="input" value={form[f.name] || ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                <option value="">Select…</option>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input className="input" placeholder={f.placeholder} value={form[f.name] || ''}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
            )}
          </div>
        ))}
        {msg && <p className="text-sm text-gold-dark">{msg}</p>}
        <button disabled={busy} className="btn-gold w-full disabled:opacity-50">{busy ? 'Uploading…' : 'Upload'}</button>
      </form>

      <div>
        <p className="mb-4 text-sm text-neutral-500">{items.length} item(s)</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {items.map((it) => (
            <div key={it.id} className="bg-white shadow-sm">
              <img src={it.image} alt="" className="aspect-square w-full object-cover" />
              <div className="p-3 text-sm">
                <p className="truncate font-medium">{it.name || it.caption || '—'}</p>
                {it.category && <p className="text-xs text-neutral-500">{it.category}{it.price ? ` · ${it.price}` : ''}</p>}
                <button onClick={() => remove(it.id)} className="mt-2 text-xs text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Hero image ---------------- */
function HeroManager({ onAuthError }) {
  const [current, setCurrent] = useState(null);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  useEffect(() => { api('/settings', { fresh: true }).then((s) => setCurrent(s.heroImage || null)); }, []);

  const run = async (fn) => {
    try { await fn(); } catch (e) { if (e.status === 401) onAuthError(); else setMsg(e.message); }
  };
  const save = () => run(async () => {
    if (!file) return setMsg('Please choose an image');
    const fd = new FormData(); fd.append('image', file);
    const s = await api('/settings/hero', { method: 'POST', body: fd, auth: true });
    setCurrent(s.heroImage); setFile(null); setMsg('Hero image updated ✓');
  });
  const reset = () => run(async () => {
    await api('/settings/hero', { method: 'DELETE', auth: true });
    setCurrent(null); setMsg('Reset to default image');
  });

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl">Change hero image</h2>
        <p className="text-sm text-neutral-500">Use a wide, landscape photo (at least 1920px wide works best).</p>
        <ImagePicker file={file} setFile={setFile} />
        {msg && <p className="text-sm text-gold-dark">{msg}</p>}
        <div className="flex gap-3">
          <button onClick={save} className="btn-gold flex-1">Save</button>
          {current && <button onClick={reset} className="btn-outline">Use default</button>}
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-neutral-500">Current hero image</p>
        <img src={current || DEFAULT_HERO} alt="" className="aspect-video w-full object-cover shadow-sm" />
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */
const TABS = [
  { id: 'products', label: 'Products (Shop)' },
  { id: 'works', label: 'Works Gallery' },
  { id: 'hero', label: 'Hero Image' },
];

export default function Admin() {
  const [authed, setAuthed] = useState(null);
  const [tab, setTab] = useState('products');

  useEffect(() => {
    if (!getToken()) return setAuthed(false);
    api('/check', { auth: true }).then(() => setAuthed(true)).catch(() => setAuthed(false));
  }, []);

  const logout = () => { setToken(null); setAuthed(false); };

  if (authed === null) return null;
  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.webp" alt="" className="h-12" />
            <span className="font-serif text-lg">Admin</span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <Link to="/" className="hover:text-gold">View site</Link>
            <button onClick={logout} className="hover:text-gold">Logout</button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1600px] gap-1 overflow-x-auto px-4 md:px-8 xl:px-12">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-xs tracking-widest uppercase ${tab === t.id ? 'border-gold text-ink' : 'border-transparent text-neutral-500'}`}>
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-8">
        {tab === 'products' && (
          <Manager endpoint="products" title="product" onAuthError={logout} fields={[
            { name: 'name', label: 'Product name', placeholder: 'e.g. Royal L-Shape Sofa', required: true },
            { name: 'category', label: 'Category', options: CATEGORIES.map((c) => c.name), required: true },
            { name: 'price', label: 'Price (optional)', placeholder: 'e.g. ₹45,000' },
          ]} />
        )}
        {tab === 'works' && (
          <Manager endpoint="works" title="work" onAuthError={logout} fields={[
            { name: 'caption', label: 'Caption / name', placeholder: 'e.g. Villa living room, Kochi' },
          ]} />
        )}
        {tab === 'hero' && <HeroManager onAuthError={logout} />}
      </div>
    </div>
  );
}
