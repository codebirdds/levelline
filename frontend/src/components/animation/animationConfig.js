// ONE place to tune the feel of the whole site. Any wrapper prop overrides these per-section.
export const ANIM = {
  duration: 900,                           // ms
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",  // smooth "expo-out" feel
  distance: 32,                            // px travel for up/down/left/right
  stagger: 90,                             // ms between children
  threshold: 0.1,                          // % of element visible before it plays
  rootMargin: "0px 0px -8% 0px",           // plays slightly after entering viewport
};

export const hiddenTransform = (variant, d = ANIM.distance) =>
  ({
    up: `translate3d(0, ${d}px, 0)`,
    down: `translate3d(0, ${-d}px, 0)`,
    left: `translate3d(${d}px, 0, 0)`,   // slides in from the right
    right: `translate3d(${-d}px, 0, 0)`, // slides in from the left
    zoom: "scale(0.94)",
    fade: "none",
  })[variant] ?? "none";
