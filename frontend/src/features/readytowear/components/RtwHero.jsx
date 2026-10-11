import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routePaths";
import { Reveal, ImageReveal } from "../../../components/animation";
import { RTW_HERO } from "../content";

export default function RtwHero() {
  return (
    <section className="relative isolate h-[70svh] w-full overflow-hidden ">
      <ImageReveal variant="zoom" scaleFrom={1.08} duration={1600} className="absolute inset-0 -z-10">
        <img src={RTW_HERO.image} alt="" className="size-full object-cover object-top" />
      </ImageReveal>
      <div className="absolute inset-0 -z-10 bg-ink/40" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-ink/60 to-transparent" />

      <div className="absolute inset-x-0 inset-y-100 bottom-0 px-3 pb-8 sm:px-5 lg:px-[2%] lg:pb-6">
        <Reveal variant="fade" delay={100}>
          <nav aria-label="Breadcrumb" className="font-sans text-[10px] font-medium text-[#DEDEDE] lg:text-xs">
            <Link to={ROUTES.HOME} className="transition hover:text-gold">Home</Link>
            <span className="mx-1.5">/</span>
            <span>Ready-to-wear</span>
          </nav>
        </Reveal>
        <Reveal delay={200}>
          <h1 className="mt-2 font-sans text-2xl font-semibold text-[#C7C7C7] sm:text-3xl lg:text-4xl">
            {RTW_HERO.title}
          </h1>
        </Reveal>
        <Reveal delay={350}>
          <p className="mt-3 max-w-[479px] font-sans text-xs font-medium leading-relaxed text-[#C3C3C3] sm:text-sm lg:mt-4 lg:text-sm lg:leading-[24px]">
            {RTW_HERO.text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}