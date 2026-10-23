import { Fragment } from "react";
import SectionHeading from "../../../components/common/SectionHeading";
import { Reveal, Stagger } from "../../../components/animation";
import { STEPS } from "../content";

function Chevron() {
  return (
    <svg
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 1l6 6-6 6" />
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section className="py-10 overflow-hidden">
      <div className="container-x">
        <Reveal>
          <SectionHeading title="How it works" underline />
        </Reveal>

        {/* ---------- Desktop: 3 aligned rows ---------- */}
        <div className="hidden lg:block mt-12 px-4">
          
          {/* Title row with chevrons between */}
          <Stagger
            className="relative grid grid-cols-5 gap-4 xl:gap-12 items-center"
            step={90}
            delay={100}
          >
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative flex justify-center w-full">
                <h3 className="text-center font-sans text-[10px] min-[1400px]:text-[12px] font-medium uppercase tracking-[0.18em] text-heading whitespace-nowrap">
                  {step.title}
                </h3>
                
                {/* Chevron perfectly centered in the gap */}
                {i < STEPS.length - 1 && (
                  <span className="absolute top-1/2 -translate-y-1/2 text-muted/70 -right-2 translate-x-1/2 xl:-right-6">
                    <Chevron />
                  </span>
                )}
              </div>
            ))}
          </Stagger>

          {/* Image row — cascade in after the titles */}
          <Stagger className="grid grid-cols-5 gap-4 mt-6 xl:gap-12" step={130} delay={250}>
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="w-full flex justify-center"
              >
                <div className="w-full max-w-[160px] aspect-[190/234]">
                  <img
                    src={step.image}
                    alt={step.title}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            ))}
          </Stagger>

          {/* Description row — cascades in last */}
          <Stagger className="grid grid-cols-5 gap-4 mt-5 xl:gap-12" step={110} delay={420}>
            {STEPS.map((step) => (
              <div key={step.title} className="flex justify-center w-full">
                <p className="text-center max-w-[160px] font-sans text-[10px] leading-relaxed text-subheading">
                  {step.text}
                </p>
              </div>
            ))}
          </Stagger>
        </div>

        {/* ---------- Mobile: stacked cards ---------- */}
        <Stagger
          as="ol"
          className="lg:hidden mt-10 space-y-12"
          step={140}
          delay={100}
        >
          {STEPS.map((step) => (
            <li
              key={step.title}
              className="flex flex-col items-center text-center"
            >
              <h3 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-heading">
                {step.title}
              </h3>
              <div className="mt-6 w-full !max-w-[100px] aspect-[214/334]">
                <img
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="mt-5 max-w-[260px] font-sans text-[12px] leading-relaxed text-subheading">
                {step.text}
              </p>
            </li>
          ))}
        </Stagger>
      </div>
    </section>
  );
}