import { Reveal, ImageReveal } from "../../../components/animation";

/**
 * Text + image side by side (stacked on mobile).
 * `className` carries the desktop grid + padding, `aspect` the image ratio.
 * imageFirst => image before text (also on mobile).
 */
export default function SplitSection({ image, alt = "", imageFirst = false, aspect, className = "", children }) {
  const picture = (
    <ImageReveal className={`${aspect} bg-cream-2`}>
      <img src={image} alt={alt} loading="lazy" className="size-full object-cover" />
    </ImageReveal>
  );
  const text = (
    <Reveal variant={imageFirst ? "left" : "right"} delay={150}>
      {children}
    </Reveal>
  );

  return (
    <section className={`grid items-center gap-8 px-5 sm:px-10 ${className}`}>
      {imageFirst ? <>{picture}{text}</> : <>{text}{picture}</>}
    </section>
  );
}
