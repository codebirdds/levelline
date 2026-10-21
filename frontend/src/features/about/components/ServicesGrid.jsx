import { Reveal } from "../../../components/animation";
import ServiceIcon from "./ServiceIcon";

function ServiceCard({ title, text, iconKey, delay, onClick }) {
  return (
    <Reveal
      as="article"
      delay={delay}
      duration={700}
      distance={20}
      // Removed h-full and min-h. It will now size naturally to the text.
      className="group flex flex-col bg-[#F5F1E9] p-4 transition-colors hover:bg-[#efeae0]"
    >
      {iconKey && (
        <span className="self-start text-[#414141]">
          <ServiceIcon name={iconKey} className="h-[18px] w-[18px]" />
        </span>
      )}

      <h3 className="mt-2.5 font-sans text-xs font-medium leading-snug text-[#414141]">
        {title}
      </h3>

      <p className="mt-2 font-sans text-[11px] leading-[1.5] text-[#808080]">
        {text}
      </p>

      {/* Arrow button pushes to bottom naturally */}
      <button
        type="button"
        onClick={onClick}
        aria-label={`${title} — learn more`}
        className="mt-auto pt-4 flex h-6 w-6 items-center justify-center self-start text-[#414141] transition-all duration-300 hover:translate-x-1 group-hover:translate-x-1"
      >
        <svg
          width="14"
          height="10"
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
      // Changed lg:grid-cols-4 to lg:grid-cols-3, and xl:grid-cols-4
      className={`grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4 ${className}`}
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