import useInView from "./useInView";
import { ANIM, hiddenTransform } from "./animationConfig";

/**
 * 1) REVEAL — fade + slide for headings, paragraphs, buttons, cards.
 * variant: up | down | left | right | zoom | fade
 * <Reveal variant="up" delay={150} distance={40}>…</Reveal>
 * Use `as` to keep valid markup: <Reveal as="li">, <Reveal as="article">
 */
export default function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  duration = ANIM.duration,
  distance = ANIM.distance,
  threshold,
  rootMargin,
  once,
  className = "",
  style,
  children,
  ...rest
}) {
  const [ref, inView] = useInView({ threshold, rootMargin, once });
  const t = `${duration}ms ${ANIM.ease} ${delay}ms`;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : hiddenTransform(variant, distance),
        transition: `opacity ${t}, transform ${t}`,
        willChange: inView ? "auto" : "opacity, transform",
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
