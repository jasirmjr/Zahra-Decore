import PageHeader from '../components/PageHeader';
import AboutContent from '../components/AboutContent';
import { Process, CtaBanner, SectionHead } from '../components/Sections';

const PRODUCTS = ['Sofas & Sectionals', 'Beds & Cots', 'Curtains & Blinds', 'Dining Sets', 'Wardrobes', 'Chairs & Recliners', 'TV Units & Cabinets', 'Cushions & Furnishings'];

export default function About() {
  return (
    <>
      <PageHeader eyebrow="About Us" title="About Zahra Decor"
        image="bedroom-warm"
        text="All interior products — manufactured by us, customised for you." />
      <AboutContent full />

      <section className="w-full bg-white py-10 sm:py-14 md:py-16">
        <div className="wrap">
          <SectionHead center eyebrow="What we make" title="Our product range">
            Everything is manufactured in our own workshop — and every item can be customised.
          </SectionHead>
          <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-3 md:grid-cols-4">
            {PRODUCTS.map((p) => (
              <div key={p} className="rounded-xl sm:rounded-2xl bg-cream px-3 py-3.5 sm:px-4 sm:py-4 text-center text-xs sm:text-sm font-semibold text-ink shadow-xs">{p}</div>
            ))}
          </div>
        </div>
      </section>

      <Process />
      <CtaBanner />
    </>
  );
}
