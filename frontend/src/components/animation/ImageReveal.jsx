import useInView from "./useInView";
import { ANIM } from "./animationConfig";

export default function ImageReveal({
  variant = "zoom",
  delay = 0,
  duration = 1200,
  scaleFrom = 1.12,
  threshold = 0.08,
  rootMargin,
  once,
  className = "",
  children,
}) {
  const [ref, inView] = useInView({ threshold, rootMargin, once });

  const isWipe = variant === "wipe";

  const outer = isWipe
    ? {
        clipPath: inView ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transition: `clip-path ${duration}ms ${ANIM.ease} ${delay}ms`,
        willChange: "clip-path",
      }
    : {
        opacity: inView ? 1 : 0,
        transition: `opacity ${Math.round(duration * 0.6)}ms ease-out ${delay}ms`,
        willChange: "opacity",
      };

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${className}`}
      style={{
        ...outer,
        // Force its own compositor layer + isolate repaints
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        contain: "layout paint",
      }}
    >
      {isWipe ? (
        children
      ) : (
        <div
          className="size-full"
          style={{
            transform: inView ? "scale(1)" : `scale(${scaleFrom})`,
            transition: `transform ${Math.round(duration * 1.2)}ms ${ANIM.ease} ${delay}ms`,
            willChange: "transform",
            transformOrigin: "center center",
            backfaceVisibility: "hidden",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}