import { useEffect, useLayoutEffect } from "react";
import useInView, { prefersReducedMotion } from "./useInView";
import { ANIM, hiddenTransform } from "./animationConfig";

/**
 * 2) STAGGER — direct children appear one after another.
 * Works with ANY children. Re-triggers every time the wrapper enters view
 * (unless `once` is passed explicitly). Cleans its inline styles after
 * each run so hover/transform classes on children keep working.
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

  // Hide before first paint — no flash of visible content
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
    const items = kids();
    if (!items.length) return;

    if (prefersReducedMotion()) {
      items.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    // ── OUT of view → reset to hidden (instant, so next entry animates) ──
    if (!inView) {
      items.forEach((el) => {
        el.style.transition = "none";
        el.style.opacity = "0";
        el.style.transform = hiddenTransform(variant, distance);
        el.style.willChange = "opacity, transform";
      });
      return;
    }

    // ── IN view → animate in with stagger ──
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
        // keep opacity: 1 inline — harmless, avoids flicker with base CSS
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