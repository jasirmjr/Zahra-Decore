import { Link } from 'react-router-dom';
import Photo from './Photo';

// Full-width image banner at the top of inner pages (sits below the 80px navbar)
export default function PageHeader({ eyebrow, title, text, image }) {
  return (
    <section className="relative mt-16 sm:mt-18 md:mt-20 flex min-h-[220px] sm:min-h-[260px] md:min-h-[320px] w-full items-end overflow-hidden">
      <Photo src={image} priority className="animate-hero absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
      <div className="wrap relative pb-6 sm:pb-8 md:pb-10 text-white">
        <p className="fade-up text-xs sm:text-sm font-semibold text-white/80">
          <Link to="/" className="hover:text-gold-light">Home</Link> <span className="mx-1.5 text-gold-light">/</span> {eyebrow}
        </p>
        <h1 className="fade-up mt-1.5 sm:mt-2 max-w-2xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{title}</h1>
        {text && <p className="fade-up mt-2 sm:mt-3 max-w-lg text-xs sm:text-sm md:text-base text-white/85">{text}</p>}
      </div>
    </section>
  );
}
