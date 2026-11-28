// Responsive image.
//  <Photo src="sofa-brown" sizes="50vw" />  -> local optimized WebP (client/public/images/sofa-brown-<width>.webp),
//                                             the browser downloads only the size the screen needs.
//  <Photo src="/uploads/abc.webp" />        -> any normal URL (admin uploads) works too.
const WIDTHS = [640, 960, 1280, 1920, 2560];
const MAX = { 'sofa-cushions': 1920, 'svc-modular-kitchen': 1920 }; // originals smaller than 2560px

const isLocal = (src) => src && !/[/:]/.test(src);
export const photoUrl = (src, w = 1280) => (isLocal(src) ? `/images/${src}-${w}.webp` : src);

export default function Photo({ src, sizes = '100vw', alt = '', priority = false, ...rest }) {
  if (!src) return null;
  const loading = priority ? 'eager' : 'lazy';
  if (!isLocal(src)) return <img src={src} alt={alt} loading={loading} decoding="async" {...rest} />;
  const widths = WIDTHS.filter((w) => w <= (MAX[src] || 2560));
  return (
    <img
      src={photoUrl(src, 1280)}
      srcSet={widths.map((w) => `${photoUrl(src, w)} ${w}w`).join(', ')}
      sizes={sizes}
      alt={alt}
      loading={loading}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? undefined : 'async'}
      {...rest}
    />
  );
}
