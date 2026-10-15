import { Reveal, ImageReveal } from "../../../components/animation";

/**
 * Text + image side by side (stacked on mobile).
 * `className` carries the desktop grid + padding, `aspect` the image ratio.
 * imageFirst => image before text (also on mobile).
 *
 * Typography for any h2/h3/p inside the text side is applied automatically —
 * override on the child itself if a section needs different sizing.
 */
export default function SplitSection({
  image,
  alt = "",
  imageFirst = false,
  aspect = "aspect-[4/5]",
  className = "",
  children,
}) {
  const picture = (
    <ImageReveal className={`${aspect} bg-cream-2`}>
      <img src={image} alt={alt} loading="lazy" className="size-full object-cover" />
    </ImageReveal>
  );

  const text = (
    <Reveal
      variant={imageFirst ? "left" : "right"}
      delay={150}
      className={[
        // ── h2 ──
        "[&_h2]:font-sans [&_h2]:font-medium",
        "[&_h2]:text-3xl [&_h2]:lg:text-4xl",
        "[&_h2]:text-[#6b6b6b]",
        // ── h3 ──
        "[&_h3]:font-sans [&_h3]:font-medium",
        "[&_h3]:text-lg [&_h3]:lg:text-md",
        "[&_h3]:text-[#6b6b6b]",
        // ── p (body) ──
        "[&_p]:font-sans [&_p]:text-sm [&_p]:leading-relaxed",
        "[&_p]:text-[#808080]",
      ].join(" ")}
    >
      {children}
    </Reveal>
  );

  return (
    <section className={`grid items-center gap-8 px-5 sm:px-10 ${className}`}>
      {imageFirst ? (
        <>
          {picture}
          {text}
        </>
      ) : (
        <>
          {text}
          {picture}
        </>
      )}
    </section>
  );
}