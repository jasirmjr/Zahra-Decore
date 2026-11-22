import { Link } from 'react-router-dom';
import Photo from './Photo';
import { ShieldIcon, RulerIcon, SofaIcon, TruckIcon, LeafIcon, ArrowCircle } from './Icons';
import { SectionHead } from './Sections';


const FEATURES = [
  [SofaIcon, 'All Interior Products', 'Sofas, beds & cots, curtains, dining, wardrobes — everything under one roof.', 'living-grey'],
  [ShieldIcon, 'We Manufacture Everything', 'Every product is made in our own workshop with strict quality checks.', 'sofa-beige'],
  [RulerIcon, 'Custom Made Furniture', 'Furniture built to your size, fabric, colour and design requirements.', 'sofa-grey-blinds'],
  [TruckIcon, 'Delivery & Installation', 'We deliver and fit everything neatly, ready to use the same day.', 'bed-cozy'],
];

export default function AboutContent({ full = false }) {
  return (
    <section id="about" className="w-full py-10 sm:py-14 md:py-16">
      <div className="wrap grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-12 items-start">
        {/* Left: text */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead eyebrow="About Zahra Decor" title="Interiors you'll love coming home to" />
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted">
            We provide <b className="text-ink">all interior products</b> — mainly <b className="text-ink">sofas, beds & cots and curtains</b>,
            along with dining sets, wardrobes, chairs and complete home furnishing.
          </p>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
            <b className="text-ink">We manufacture all our products</b> ourselves, and we also
            <b className="text-ink"> make customised furniture based on your requirements</b> — any size, any fabric, any design.
          </p>
          {!full && <Link to="/about" className="btn-gold mt-6 sm:mt-8">More About Us <ArrowCircle /></Link>}
        </div>

        {/* Right: 2x2 feature cards with image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 md:gap-5">
          {FEATURES.map(([Icon, t, d, img]) => (
            <div key={t} className="group flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-card shadow-xs transition hover:shadow-xl">
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-lg sm:rounded-xl bg-white text-gold"><Icon width={18} /></span>
                  <h3 className="text-base sm:text-lg font-bold leading-tight text-ink">{t}</h3>
                </div>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted">{d}</p>
              </div>
              <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full overflow-hidden">
                <Photo src={img} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
