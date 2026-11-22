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

      <section className="w-full bg-white py-20">
        <div className="wrap">
          <SectionHead center eyebrow="What we make" title="Our product range">
            Everything is manufactured in our own workshop — and every item can be customised.
          </SectionHead>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {PRODUCTS.map((p) => (
              <div key={p} className="rounded-2xl bg-cream px-4 py-5 text-center font-semibold">{p}</div>
            ))}
          </div>
        </div>
      </section>

      <Process />
      <CtaBanner />
    </>
  );
}
