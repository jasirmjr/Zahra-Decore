import { Link } from 'react-router-dom';
import Photo from './Photo';

// Full-width image banner at the top of inner pages (sits below the 80px navbar)
export default function PageHeader({ eyebrow, title, text, image }) {
  return (
    <section className="relative mt-20 flex min-h-[380px] w-full items-end overflow-hidden md:min-h-[460px]">
      <Photo src={image} priority className="animate-hero absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
      <div className="wrap relative pb-12 text-white md:pb-16">
        <p className="fade-up text-sm font-semibold text-white/80">
          <Link to="/" className="hover:text-gold-light">Home</Link> <span className="mx-1.5 text-gold-light">/</span> {eyebrow}
        </p>
        <h1 className="fade-up mt-3 max-w-2xl text-4xl leading-tight md:text-6xl">{title}</h1>
        {text && <p className="fade-up mt-4 max-w-lg text-lg text-white/85">{text}</p>}
      </div>
    </section>
  );
}
