import { Fragment } from "react";
import SectionHeading from "../../../components/common/SectionHeading";
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
    <section className=" py-10">
      <div className="container-x">
        <SectionHeading title="How it works" underline />

        {/* ---------- Desktop: 3 aligned rows ---------- */}
        <div className="hidden lg:block mt-12">
          {/* Title row with chevrons between */}
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-x-6">
            {STEPS.map((step, i) => (
              <Fragment key={step.title}>
                <h3 className="text-center font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-heading whitespace-nowrap">
                  {step.title}
                </h3>
                {i < STEPS.length - 1 && (
                  <span className="text-muted/70 flex flex-row gap-0 items-center justify-center ">
                    <Chevron /> 
                  </span>
                )}
              </Fragment>
            ))}
          </div>

          {/* Image row — locked box, contained image */}
          <div className="grid grid-cols-5 gap-20 mt-4 ml-9">
            {STEPS.map((step) => (
              <div key={step.title} className=" w-full max-w-[160px] aspect-[190/234]">
                <img
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                  className="h-full w-auto fit-contain"
                />
              </div>
            ))}
          </div>

          {/* Description row */}
          <div className="grid grid-cols-5 gap-16 mt-5">
            {STEPS.map((step) => (
              <p
                key={step.title}
                className="text-center max-w-[190px] font-sans text-[10px] leading-relaxed text-subheading"
              >
                {step.text}
              </p>
            ))}
          </div>
        </div>

        {/* ---------- Mobile: stacked cards ---------- */}
        <ol className="lg:hidden mt-10 space-y-12">
          {STEPS.map((step) => (
            <li key={step.title} className="flex flex-col items-center text-center">
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
        </ol>
      </div>
    </section>
  );
}