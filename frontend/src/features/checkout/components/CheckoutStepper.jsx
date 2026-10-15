const STEPS = ["Shopping Bag", "Address", "Payment", "Confirm"];

export default function CheckoutStepper({ current = 1 }) {
  return (
    <div className="container-x pt-8 pb-6 lg:pt-10 lg:pb-8">
      <div className="mx-auto flex max-w-2xl items-start">
        {STEPS.map((label, i) => {
          const num = i + 1;
          const done = num < current;
          const active = num === current;
          return (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {/* left connector */}
                <span
                  className={`h-[2px] flex-1 ${
                    i === 0 ? "bg-transparent" : done || active ? "bg-[#2f8f3e]" : "bg-border"
                  }`}
                />
                {/* circle */}
                <span
                  className={`flex size-6 items-center justify-center rounded-full border-2 transition ${
                    done || active
                      ? "border-[#2f8f3e] bg-[#2f8f3e] text-white"
                      : "border-border bg-white"
                  }`}
                >
                  {(done || active) && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  )}
                </span>
                {/* right connector */}
                <span
                  className={`h-[2px] flex-1 ${
                    i === STEPS.length - 1
                      ? "bg-transparent"
                      : done
                      ? "bg-[#2f8f3e]"
                      : "bg-border"
                  }`}
                />
              </div>
              <p
                className={`mt-2 font-sans text-xs lg:text-sm ${
                  active ? "font-medium text-[#414141]" : "text-[#808080]"
                }`}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
