import PageHeader from '../components/PageHeader';
import Photo from '../components/Photo';
import { CtaBanner } from '../components/Sections';
import { WhatsAppIcon, ArrowCircle } from '../components/Icons';
import { SITE, waLink } from '../config';


const SERVICES = [
  {
    title: 'Custom Furniture Manufacturing',
    text: 'Furniture built exactly to your requirement — size, design, wood, fabric and colour of your choice. Bring a photo or idea and we will make it.',
    points: ['Made-to-measure designs', 'Choice of wood & finish', 'Home & office furniture'],
    image: 'sofa-grey-blinds',
  },
  {
    title: 'Sofas & Seating',
    text: 'Sofa sets, L-shaped sectionals, recliners, diwans and accent chairs crafted for comfort and long life.',
    points: ['Fabric & leatherette options', 'High-density foam', 'Custom sizes'],
    image: 'sofa-brown',
  },
  {
    title: 'Beds & Cots',
    text: 'Wooden and upholstered beds, cots with storage and kids’ beds in all standard and custom sizes.',
    points: ['Hydraulic & box storage', 'Cushioned headboards', 'Single, double, queen & king'],
    image: 'bed-woven',
  },
  {
    title: 'Curtains & Blinds',
    text: 'Designer curtains, sheers, blackout curtains and blinds — stitched in-house and professionally installed.',
    points: ['Free measurement', 'Wide fabric collection', 'Rods, tracks & motorised options'],
    image: 'bedroom-curtains',
  },
  {
    title: 'Dining & Wardrobes',
    text: 'Dining tables, chairs, wardrobes, TV units and cabinets designed to make the most of your space.',
    points: ['Space-saving designs', 'Laminate, veneer & solid wood', 'Matching sets'],
    image: 'dining-living',
  },
  {
    title: 'Upholstery & Renovation',
    text: 'Give your old furniture a new life — re-upholstery, foam replacement, polishing and repair.',
    points: ['Sofa re-covering', 'Foam & cushion refill', 'Polish & repair'],
    image: 'sofa-cushions',
  },
  {
    title: 'Complete Interior Solutions',
    text: 'From planning to installation, we furnish complete homes, villas, flats and offices with a single team.',
    points: ['Design consultation', 'Furniture + furnishing package', 'On-time installation'],
    image: 'living-lsofa',
  },
];

export default function Services() {
  return (
    <>
      <PageHeader eyebrow="Services" title="Our Services"
        image="sofa-beige"
        text="Everything for your interior — designed, manufactured and installed by us." />

      {SERVICES.map((s, i) => (
        <section key={s.title} className={`w-full py-10 sm:py-12 md:py-14 ${i % 2 ? 'bg-white' : 'bg-cream'}`}>
          <div className="wrap grid items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-14">
            <div className={`aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-2xl shadow-xs ${i % 2 ? 'md:order-2' : ''}`}>
              <Photo src={s.image} alt={s.title} sizes="(min-width: 768px) 50vw, 100vw" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="inline-grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl bg-gold/15 text-base sm:text-lg font-bold text-gold">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="title mt-3 !text-2xl sm:!text-3xl">{s.title}</h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">{s.text}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {s.points.map((p) => (
                  <li key={p} className={`rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold ${i % 2 ? 'bg-cream' : 'bg-white'}`}>✓ {p}</li>
                ))}
              </ul>
              <a href={waLink(`Hello ${SITE.name}, I would like to enquire about: ${s.title}`)} target="_blank" rel="noreferrer"
                className="btn-gold mt-6"><WhatsAppIcon width={16} /> Enquire Now <ArrowCircle /></a>
            </div>
          </div>
        </section>
      ))}

      <CtaBanner />
    </>
  );
}
