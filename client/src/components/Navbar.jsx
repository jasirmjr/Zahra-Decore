import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MenuIcon, CloseIcon, ArrowCircle } from './Icons';
import { waLink } from '../config';

const LINKS = [
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

// Fixed, full-width navbar. Height = 80px (h-20) – pages offset their content by this.
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkCls = ({ isActive }) =>
    `relative py-2 text-[15px] font-semibold transition hover:text-gold after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-gold after:transition-transform ${
      isActive ? 'text-gold after:scale-x-100' : 'text-ink after:scale-x-0 hover:after:scale-x-100'}`;

  return (
    <header className={`fixed inset-x-0 top-0 z-40 w-full border-b border-black/5 bg-white transition-shadow ${scrolled || open ? 'shadow-[0_6px_24px_-12px_rgba(0,0,0,0.25)]' : ''}`}>
      <nav className="wrap flex h-16 sm:h-18 md:h-20 items-center justify-between">
        <Link to="/" aria-label="Zahra Decor home">
          <img src="/logo.webp" alt="Zahra Decor" className="h-12 sm:h-14 md:h-16 w-auto object-contain" />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex xl:gap-10">
          {LINKS.map((l) => (
            <li key={l.to}><NavLink to={l.to} className={linkCls}>{l.label}</NavLink></li>
          ))}
        </ul>

        <a href={waLink()} target="_blank" rel="noreferrer" className="btn-gold hidden lg:inline-flex">
          Enquire Now <ArrowCircle />
        </a>

        <button className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-lg bg-cream lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-white lg:hidden">
          <ul className="wrap flex flex-col gap-2 py-4">
            {LINKS.map((l) => (
              <li key={l.to}><NavLink to={l.to} className={(s) => `block w-fit ${linkCls(s)}`}>{l.label}</NavLink></li>
            ))}
            <li className="pt-2">
              <a href={waLink()} target="_blank" rel="noreferrer" className="btn-gold w-full justify-between">Enquire Now <ArrowCircle /></a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
