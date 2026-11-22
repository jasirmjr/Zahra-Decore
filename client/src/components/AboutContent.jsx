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
    <section id="about" className="w-full py-20 lg:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        {/* Left: text */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead eyebrow="About Zahra Decor" title="Interiors you'll love coming home to" />
          <p className="mt-6 leading-relaxed text-muted">
            We provide <b className="text-ink">all interior products</b> — mainly <b className="text-ink">sofas, beds & cots and curtains</b>,
            along with dining sets, wardrobes, chairs and complete home furnishing.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            <b className="text-ink">We manufacture all our products</b> ourselves, and we also
            <b className="text-ink"> make customised furniture based on your requirements</b> — any size, any fabric, any design.
          </p>
          {!full && <Link to="/about" className="btn-gold mt-8">More About Us <ArrowCircle /></Link>}

        
        </div>

        {/* Right: 2x2 feature cards with image */}
        <div className="grid gap-5 sm:grid-cols-2">
          {FEATURES.map(([Icon, t, d, img], i) => (
            <div key={t} className={`group flex flex-col justify-between overflow-hidden rounded-3xl bg-card transition hover:shadow-xl ${i % 2 ? 'sm:mt-8' : ''}`}>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-gold"><Icon /></span>
                  <h3 className="text-lg leading-tight">{t}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{d}</p>
              </div>
              <div className="relative aspect-[16/11] w-full overflow-hidden">
                <Photo src={img} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
