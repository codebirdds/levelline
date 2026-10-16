import { Reveal } from "../../../components/animation";
import ServiceIcon from "./ServiceIcon";

function ServiceCard({ title, text, iconKey, delay, onClick }) {
  return (
    <Reveal
      as="article"
      delay={delay}
      duration={700}
      distance={20}
      className="group flex aspect-[5/4] h-full w-full flex-col bg-[#F5F1E9] p-3 transition-colors hover:bg-[#efeae0]"
    >
      {iconKey && (
        <span className="self-start text-[#414141]">
          <ServiceIcon name={iconKey} className="h-4 w-4" />
        </span>
      )}

      <h3 className="mt-2 font-sans text-[10px] font-medium leading-snug text-[#414141]">
        {title}
      </h3>

      <p className="mt-1.5 font-sans text-[9px] leading-[1.5] text-[#808080]">
        {text}
      </p>

      {/* Arrow button — nice hover state, ready for onClick */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`${title} — learn more`}
        className="mt-auto flex h-6 w-6 items-center justify-center self-start rounded-full text-[#414141] transition-all duration-300 hover:bg-[#414141] hover:text-white group-hover:translate-x-1"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 18 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M1 6h16M12 1l5 5-5 5" />
        </svg>
      </button>
    </Reveal>
  );
}

export default function ServicesGrid({ items = [], className = "", onItemClick }) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-2 ${className}`}
    >
      {items.map((s, i) => (
        <ServiceCard
          key={s.title}
          {...s}
          delay={i * 80}
          onClick={onItemClick ? () => onItemClick(s) : undefined}
        />
      ))}
    </div>
  );
}