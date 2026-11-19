import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { submitContactThunk } from "../contactThunks";
import { resetContact, selectContactSubmitting } from "../contactSlice";

const EMPTY = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  project_description: "",
};

/* ── animation timings (ms) ── */
const ENTER_MS = 600; // panel slide-in (slower, premium feel)
const EXIT_MS = 320; // panel slide-out

/* Staggered reveal — transform/opacity only, stays on GPU */
/* Staggered reveal — ab right se left slide + fade rise */
const ANIM_CSS = `
@keyframes rrSlideIn {
  from { opacity: 0; transform: translate3d(56px, 10px, 0); }
  to   { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes rrFade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.rr-item { animation: rrSlideIn 540ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.rr-fade { animation: rrFade 500ms ease-out both; }

@media (prefers-reduced-motion: reduce) {
  .rr-item, .rr-fade { animation: none !important; }
  .rr-panel, .rr-overlay { transition: none !important; }
}
`;

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export default function BookAppointmentModal({ open, onClose }) {
  const dispatch = useDispatch();
  const submitting = useSelector(selectContactSubmitting);

  /* ── mount / unmount orchestration so the exit animation can play ── */
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [countryCode, setCountryCode] = useState("+91");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setMounted(true);
      // double rAF = guarantee the browser paints the off-screen state first
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }

    setVisible(false);
    const t = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [open]);

  /* ── lock body scroll while mounted ── */
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  useEffect(() => {
    if (open) {
      setStep(1);
      setForm(EMPTY);
      setCountryCode("+91");
      setError("");
      dispatch(resetContact());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    if (!form.first_name.trim()) return "First name is required";
    if (!form.last_name.trim()) return "Last name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email";

    if (!countryCode.trim()) return "Country code is required";
    if (!form.phone.trim()) return "Phone is required";

    if (countryCode === "+91") {
      if (form.phone.length !== 10) {
        return "Indian phone numbers must be exactly 10 digits";
      }
    } else {
      if (form.phone.length < 5) {
        return "Please enter a valid phone number";
      }
    }

    if (!form.project_description.trim()) return "Please write a short message";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) return setError(err);

    setError("");
    try {
      const finalPayload = {
        ...form,
        phone: `${countryCode}${form.phone}`,
      };

      await dispatch(submitContactThunk(finalPayload));
      toast.success("Appointment request sent! We'll be in touch.");
      setStep(2);
    } catch {
      // error is also in slice
    }
  };

  return (
    <>
      <style>{ANIM_CSS}</style>

      {/* ── Overlay ── */}
      <div
        className="rr-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 sm:justify-end"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        style={{
          transitionProperty: "opacity",
          transitionDuration: `${visible ? 400 : 260}ms`,
          transitionTimingFunction: "ease-out",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        {/* ── Panel (slides in from the right) ── */}
        <div
          className="rr-panel flex h-[100dvh] w-full max-w-[560px] flex-col border-l border-[#d9d9d9] bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
          style={{
            transitionProperty: "transform",
            transitionDuration: `${visible ? ENTER_MS : EXIT_MS}ms`,
            transitionTimingFunction: visible
              ? "cubic-bezier(0.22, 1, 0.36, 1)"
              : "cubic-bezier(0.4, 0, 1, 1)",
            transform: visible ? "translate3d(0,0,0)" : "translate3d(100%,0,0)",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          {/* ── Header — ab rise animation ke saath ── */}
          <div className="flex items-start justify-between gap-4 px-5 pt-6 pb-4 sm:px-7">
            <div className="rr-item" style={{ animationDelay: "120ms" }}>
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-[#808080]">
                Private Fitting
              </p>
              <h2 className="mt-2 font-sans text-[22px] font-normal text-[#1a1a1a]">
                Book Appointment
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rr-item rounded border border-[#d9d9d9] p-1 text-[#414141] transition hover:bg-[#f5f5f5]"
              style={{ animationDelay: "240ms" }}
            >
              <CloseIcon />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
            {step === 1 && (
              <>
                <h3
                  className="rr-item mb-6 font-sans text-[15px] font-medium text-[#414141]"
                  style={{ animationDelay: "360ms" }}
                >
                  Want the Perfect Fit? Let's Connect
                </h3>

                <div className="space-y-4 sm:space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                    <Field
                      label="First Name"
                      required
                      placeholder="First Name"
                      value={form.first_name}
                      onChange={set("first_name")}
                      delay={470}
                    />
                    <Field
                      label="Last Name"
                      required
                      placeholder="Last Name"
                      value={form.last_name}
                      onChange={set("last_name")}
                      delay={570}
                    />
                    <Field
                      label="Email"
                      required
                      type="email"
                      placeholder="Enter Your Email Address"
                      value={form.email}
                      onChange={set("email")}
                      delay={670}
                    />

                    {/* ✅ Country Code + Phone Input */}
                    <div className="rr-item" style={{ animationDelay: "770ms" }}>
                      <label className="mb-1.5 block font-sans text-[13px] font-medium text-[#808080]">
                        Phone<span className="text-[#1a1a1a]">*</span>
                      </label>
                      <div className="flex h-10 w-full border border-[#d9d9d9] bg-white transition-colors focus-within:border-[#1a1a1a]">
                        <input
                          type="text"
                          value={countryCode}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (!val.startsWith("+")) val = "+" + val.replace(/\D/g, "");
                            else val = "+" + val.slice(1).replace(/\D/g, "");
                            setCountryCode(val.slice(0, 4));
                          }}
                          className="w-[64px] shrink-0 border-r border-[#d9d9d9] bg-[#fafafa] px-2 text-center font-sans text-sm text-[#414141] outline-none"
                        />
                        <input
                          type="tel"
                          placeholder="Phone number"
                          value={form.phone}
                          onChange={(e) => {
                            const maxLen = countryCode === "+91" ? 10 : 15;
                            const val = e.target.value.replace(/\D/g, "").slice(0, maxLen);
                            setForm((f) => ({ ...f, phone: val }));
                          }}
                          className="w-full flex-1 bg-transparent px-3 font-sans text-sm text-[#414141] outline-none placeholder:text-[#b0b0b0]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rr-item" style={{ animationDelay: "870ms" }}>
                    <label className="mb-1.5 block font-sans text-[13px] font-medium text-[#808080]">
                      Write a message<span className="text-[#1a1a1a]">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder=""
                      value={form.project_description}
                      onChange={set("project_description")}
                      className="w-full resize-none border border-[#d9d9d9] bg-white px-3 py-2.5 font-sans text-sm text-[#414141] outline-none placeholder:text-[#b0b0b0] focus:border-[#1a1a1a]"
                    />
                  </div>

                  {error && <p className="font-sans text-xs text-[#c0392b]">{error}</p>}
                </div>
              </>
            )}

            {/* Success Screen */}
            {step === 2 && (
              <div
                className="rr-item flex h-full flex-col items-center justify-center py-10 text-center"
                style={{ animationDelay: "80ms" }}
              >
                <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-emerald-50">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <h3 className="font-sans text-xl font-medium text-[#1a1a1a]">
                  Request Received
                </h3>
                <p className="mx-auto mt-3 max-w-[340px] px-2 font-sans text-sm leading-relaxed text-[#808080]">
                  Our team will reach out within 24 hours to confirm your
                  appointment.
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-10 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#663f29]"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          {step === 1 && (
            <div
              className="rr-item flex items-center justify-between gap-4 border-t border-[#e5e5e5] px-5 py-4 sm:px-7"
              style={{ animationDelay: "970ms" }}
            >
              <button
                onClick={onClose}
                className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-[#414141] transition hover:text-[#663f29]"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#663f29] disabled:opacity-60 sm:px-8"
              >
                {submitting ? "Submitting…" : "Submit"} <span aria-hidden>→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, required, delay = 0, ...props }) {
  return (
    <div className="rr-item" style={{ animationDelay: `${delay}ms` }}>
      <label className="mb-1.5 block font-sans text-[13px] font-medium text-[#808080]">
        {label}
        {required && <span className="text-[#1a1a1a]">*</span>}
      </label>
      <input
        {...props}
        className="h-10 w-full border border-[#d9d9d9] bg-white px-3 font-sans text-sm text-[#414141] outline-none placeholder:text-[#b0b0b0] focus:border-[#1a1a1a]"
      />
    </div>
  );
}