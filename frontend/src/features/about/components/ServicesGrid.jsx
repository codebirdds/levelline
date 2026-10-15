import { Reveal } from "../../../components/animation";
import ServiceIcon from "./ServiceIcon";

function ServiceCard({ title, text, iconKey, delay }) {
  return (
    <Reveal
      as="article"
      delay={delay}
      duration={700}
      distance={20}
      className="flex flex-col bg-[#F5F1E9] p-3 lg:p-3.5"
    >
      {iconKey && (
        <span className="self-start text-[#414141]">
          <ServiceIcon name={iconKey} className="h-5 w-5 lg:h-6 lg:w-6" />
        </span>
      )}

      <h3 className="mt-2.5 font-sans text-[13px] font-medium leading-snug text-[#414141] lg:text-sm">
        {title}
      </h3>

      <p className="mt-1.5 font-sans text-[11px] leading-[1.5] text-[#808080] lg:text-xs">
        {text}
      </p>

      <svg
        width="14"
        height="10"
        viewBox="0 0 18 12"
        fill="none"
        stroke="#414141"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-3"
        aria-hidden="true"
      >
        <path d="M1 6h16M12 1l5 5-5 5" />
      </svg>
    </Reveal>
  );
}

export default function ServicesGrid({ items = [], className = "" }) {
  const top = items.slice(0, 5);
  const bottom = items.slice(5);

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {/* Top row — 5 cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {top.map((s, i) => (
          <ServiceCard key={s.title} {...s} delay={i * 80} />
        ))}
      </div>

      {/* Bottom row — 3 cards, centered & narrower */}
      {bottom.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:mx-auto lg:w-[62%]">
          {bottom.map((s, i) => (
            <ServiceCard
              key={s.title}
              {...s}
              delay={(i + top.length) * 80}
            />
          ))}
        </div>
      )}
    </div>
  );
}