import { useEffect, useLayoutEffect } from "react";
import useInView, { prefersReducedMotion } from "./useInView";
import { ANIM, hiddenTransform } from "./animationConfig";

/**
 * 2) STAGGER — direct children appear one after another (steps, process, lists, footer columns).
 * Works with ANY children (no props needed on them). Cleans its inline styles afterwards,
 * so your own hover/transform classes keep working.
 * <Stagger className="grid grid-cols-4" step={120}>…children…</Stagger>
 */
export default function Stagger({
  as: Tag = "div",
  variant = "up",
  step = ANIM.stagger,
  delay = 0,
  duration = ANIM.duration,
  distance = ANIM.distance,
  threshold,
  rootMargin,
  once,
  className = "",
  children,
  ...rest
}) {
  const [ref, inView] = useInView({ threshold, rootMargin, once });
  const kids = () => Array.from(ref.current?.children ?? []);

  // hide before first paint (no flash)
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    kids().forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = hiddenTransform(variant, distance);
      el.style.willChange = "opacity, transform";
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const items = kids();
    const raf = requestAnimationFrame(() => {
      items.forEach((el, i) => {
        const t = `${duration}ms ${ANIM.ease} ${delay + i * step}ms`;
        el.style.transition = `opacity ${t}, transform ${t}`;
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    });
    const cleanup = setTimeout(() => {
      items.forEach((el) => {
        el.style.removeProperty("transition");
        el.style.removeProperty("transform");
        el.style.removeProperty("will-change");
      });
    }, delay + duration + items.length * step + 120);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(cleanup);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
