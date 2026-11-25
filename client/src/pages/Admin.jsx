import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getToken, setToken } from '../api';
import { CATEGORIES, DEFAULT_HERO } from '../config';
import { uploadMedia, isVideo, MAX_VIDEO_MB } from '../upload';

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

/* ---------------- Multi-file picker (photos + videos) ---------------- */
const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;

function FileThumb({ file }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  if (!url) return <div className="h-14 w-14 shrink-0 bg-neutral-100" />;
  return isVideo(file)
    ? <video src={url} muted preload="metadata" className="h-14 w-14 shrink-0 bg-black object-cover" />
    : <img src={url} alt="" className="h-14 w-14 shrink-0 object-cover" />;
}

function FilePicker({ entries, setEntries, videos, multiple, busy }) {
  const add = (list) => {
    const files = [...list].filter((f) => f.type.startsWith('image/') || (videos && isVideo(f)));
    const next = files.map((file) => ({ key: `${file.name}-${file.size}-${Math.random()}`, file, progress: 0, status: 'ready' }));
    setEntries((cur) => (multiple ? [...cur.filter((e) => e.status !== 'done'), ...next] : next.slice(0, 1)));
  };
  return (
    <div>
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (!busy) add(e.dataTransfer.files); }}
        className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed border-neutral-300 bg-neutral-50 p-4 text-center text-sm text-neutral-500 hover:border-gold">
        <span className="font-medium text-ink">Click to choose {videos ? 'photos & videos' : multiple ? 'photos' : 'a photo'}</span>
        <span className="text-xs">{multiple ? 'You can select many files at once, or drag & drop them here' : 'or drag & drop it here'}</span>
        {videos && <span className="text-xs">Videos: MP4 works best · up to {MAX_VIDEO_MB} MB each</span>}
        <input type="file" multiple={multiple} disabled={busy} className="hidden"
          accept={videos ? 'image/*,video/*' : 'image/*'}
          onChange={(e) => { add(e.target.files); e.target.value = ''; }} />
      </label>

      {entries.length > 0 && (
        <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto">
          {entries.map((en) => (
            <li key={en.key} className="flex items-center gap-3 bg-neutral-50 p-2">
              <FileThumb file={en.file} />
              <div className="min-w-0 flex-1 text-xs">
                <p className="truncate font-medium text-ink">{isVideo(en.file) ? 'Video · ' : 'Photo · '}{en.file.name}</p>
                <p className={en.status === 'error' ? 'text-red-600' : 'text-neutral-500'}>
                  {en.status === 'ready' && mb(en.file.size)}
                  {en.status === 'uploading' && `Uploading… ${Math.round(en.progress)}%`}
                  {en.status === 'done' && 'Uploaded ✓'}
                  {en.status === 'error' && en.error}
                </p>
                {en.status === 'uploading' && (
                  <div className="mt-1 h-1 bg-neutral-200"><div className="h-full bg-gold transition-all" style={{ width: `${en.progress}%` }} /></div>
                )}
              </div>
              {!busy && en.status !== 'done' && (
                <button type="button" onClick={() => setEntries((cur) => cur.filter((x) => x.key !== en.key))}
                  className="px-2 text-lg leading-none text-neutral-400 hover:text-red-600" aria-label="Remove">×</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- Generic collection manager ---------------- */
// videos: allow video files too · multiple: allow many files in one go (each becomes its own item)
function Manager({ endpoint, fields, title, onAuthError, videos = false, multiple = false }) {
  const [items, setItems] = useState([]);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => api(`/${endpoint}`, { fresh: true }).then(setItems);
  useEffect(() => { load(); setForm({}); setEntries([]); setMsg(''); }, [endpoint]);

  const handle = async (fn) => {
    try { await fn(); } catch (e) { if (e.status === 401) onAuthError(); else setMsg(e.message); }
  };
  const patch = (key, changes) => setEntries((cur) => cur.map((e) => (e.key === key ? { ...e, ...changes } : e)));

  const submit = async (e) => {
    e.preventDefault();
    const todo = entries.filter((en) => en.status !== 'done');
    if (!todo.length) return setMsg(`Please choose ${videos ? 'photos or videos' : 'a photo'}`);
    const missing = fields.find((f) => f.required && !form[f.name]);
    if (missing) return setMsg(`Please fill ${missing.label}`);
    setBusy(true); setMsg('');
    let ok = 0;
    for (const en of todo) {
      patch(en.key, { status: 'uploading', progress: 0, error: undefined });
      try {
        const media = await uploadMedia(en.file, (p) => patch(en.key, { progress: p }));
        await api(`/${endpoint}`, { method: 'POST', body: { ...form, ...media }, auth: true });
        patch(en.key, { status: 'done', progress: 100 });
        ok++;
      } catch (err) {
        if (err.status === 401) { setBusy(false); onAuthError(); return; }
        patch(en.key, { status: 'error', error: err.message || 'Upload failed' });
      }
    }
    setBusy(false);
    setMsg(ok === todo.length ? `${ok} file(s) uploaded ✓` : `${ok} of ${todo.length} uploaded — see errors above`);
    if (ok === todo.length) setForm({});
    await load().catch(() => {});
  };

  const remove = (id) => {
    if (!confirm('Delete this item?')) return;
    handle(async () => { await api(`/${endpoint}/${id}`, { method: 'DELETE', auth: true }); await load(); });
  };

  const pending = entries.filter((en) => en.status !== 'done').length;
  return (
    <div className="grid gap-10 lg:grid-cols-[400px_1fr]">
      <form onSubmit={submit} className="h-fit space-y-4 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl">Add {title}</h2>
        <FilePicker entries={entries} setEntries={setEntries} videos={videos} multiple={multiple} busy={busy} />
        {multiple && fields.length > 0 && <p className="text-xs text-neutral-500">The details below are applied to every file in this upload.</p>}
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
        <button disabled={busy} className="btn-gold w-full disabled:opacity-50">
          {busy ? 'Uploading… keep this page open' : pending > 1 ? `Upload ${pending} files` : 'Upload'}
        </button>
      </form>

      <div>
        <p className="mb-4 text-sm text-neutral-500">{items.length} item(s)</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {items.map((it) => (
            <div key={it.id} className="bg-white shadow-sm">
              <div className="relative aspect-square bg-neutral-800">
                {(it.thumb || it.image)
                  ? <img src={it.thumb || it.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                  : it.video && <video src={it.video} muted preload="metadata" className="h-full w-full object-cover" />}
                {it.video && <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">▶ Video</span>}
              </div>
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
  { id: 'works', label: 'Projects' },
  { id: 'gallery', label: 'Gallery' },
];

export default function Admin() {
  const [authed, setAuthed] = useState(null);
  const [tab, setTab] = useState('works');

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
        {tab === 'works' && (
          <Manager endpoint="works" title="project photos & videos" videos multiple onAuthError={logout} fields={[
            { name: 'caption', label: 'Caption / name', placeholder: 'e.g. Villa living room, Kochi' },
          ]} />
        )}
        {tab === 'gallery' && (
          <Manager endpoint="gallery" title="gallery photos & videos" videos multiple onAuthError={logout} fields={[
            { name: 'caption', label: 'Caption (optional)', placeholder: 'e.g. Gypsum ceiling with cove lights' },
            { name: 'category', label: 'Category (optional)', options: CATEGORIES.map((c) => c.name) },
          ]} />
        )}
      </div>
    </div>
  );
}
