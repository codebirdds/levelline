import { Reveal } from "../../../components/animation";
import { TYPE } from "../../../components/common/typography";

function ServiceCard({ title, text, icon, delay }) {
  return (
    <Reveal as="article" delay={delay} duration={800} distance={24} className="flex flex-col bg-[#f6f3ee] p-4 xl:min-h-[213px] xl:p-[15px]">
      {icon && <img src={icon} alt="" loading="lazy" className="h-10 w-auto self-start object-contain xl:h-[50px]" />}
      <h3 className={`mt-4 xl:mt-5 ${TYPE.h3}`}>{title}</h3>
      <p className={TYPE.p}>{text}</p>
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-auto pt-5" aria-hidden="true">
        <path d="M1 6h16M12 1l5 5-5 5" />
      </svg>
    </Reveal>
  );
}

/** items = [{ title, text, icon }]. First 5 form the top row, the rest the centered bottom row (xl+). */
export default function ServicesGrid({ items = [], className = "" }) {
  const top = items.slice(0, 5);
  const bottom = items.slice(5);

  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 xl:flex xl:flex-col xl:gap-2.5 ${className}`}>
      <div className="contents xl:grid xl:grid-cols-5 xl:gap-[11px]">
        {top.map((s, i) => <ServiceCard key={s.title} {...s} delay={i * 90} />)}
      </div>
      <div className="contents xl:mx-auto xl:grid xl:w-[80%] xl:grid-cols-3 xl:gap-2.5">
        {bottom.map((s, i) => <ServiceCard key={s.title} {...s} delay={(i + top.length) * 90} />)}
      </div>
    </div>
  );
}
