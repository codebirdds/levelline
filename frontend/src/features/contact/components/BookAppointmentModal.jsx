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

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export default function BookAppointmentModal({ open, onClose }) {
  const dispatch = useDispatch();
  const submitting = useSelector(selectContactSubmitting);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [countryCode, setCountryCode] = useState("+91");
  const [error, setError] = useState("");

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

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    if (!form.first_name.trim()) return "First name is required";
    if (!form.last_name.trim()) return "Last name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email";
    
    if (!countryCode.trim()) return "Country code is required";
    if (!form.phone.trim()) return "Phone is required";
    
    // ✅ Strict validation for India (+91)
    if (countryCode === "+91") {
      if (form.phone.length !== 10) {
        return "Indian phone numbers must be exactly 10 digits";
      }
    } else {
      // Loose validation for other countries
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex h-[100vh] w-full max-w-[560px] flex-col border-l border-[#d9d9d9] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 px-7 pt-6 pb-4">
          <div>
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
            className="rounded border border-[#d9d9d9] p-1 text-[#414141] transition hover:bg-[#f5f5f5]"
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {step === 1 && (
            <>
              <h3 className="mb-6 font-sans text-[15px] font-medium text-[#414141]">
                Want the Perfect Fit? Let's Connect
              </h3>

              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="First Name"
                    required
                    placeholder="First Name"
                    value={form.first_name}
                    onChange={set("first_name")}
                  />
                  <Field
                    label="Last Name"
                    required
                    placeholder="Last Name"
                    value={form.last_name}
                    onChange={set("last_name")}
                  />
                  <Field
                    label="Email"
                    required
                    type="email"
                    placeholder="Enter Your Email Address"
                    value={form.email}
                    onChange={set("email")}
                  />
                  
                  {/* ✅ Country Code + Phone Input */}
                  <div>
                    <label className="mb-1.5 block font-sans text-[13px] font-medium text-[#808080]">
                      Phone<span className="text-[#1a1a1a]">*</span>
                    </label>
                    <div className="flex h-10 w-full border border-[#d9d9d9] bg-white transition-colors focus-within:border-[#1a1a1a]">
                      {/* Country Code */}
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
                      {/* Phone Number */}
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={form.phone}
                        onChange={(e) => {
                          // ✅ Limit to 10 digits ONLY if country code is +91
                          const maxLen = countryCode === "+91" ? 10 : 15;
                          const val = e.target.value.replace(/\D/g, "").slice(0, maxLen);
                          setForm((f) => ({ ...f, phone: val }));
                        }}
                        className="w-full flex-1 bg-transparent px-3 font-sans text-sm text-[#414141] outline-none placeholder:text-[#b0b0b0]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block font-sans text-[13px] font-medium text-[#808080]">
                    Write a message<span className="text-[#1a1a1a]">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder=""
                    value={form.project_description}
                    onChange={set("project_description")}
                    className="w-full resize-none border border-[#d9d9d9] bg-white px-3 py-2.5 font-sans text-sm text-[#414141] outline-none placeholder:text-[#b0b0b0] focus:border-[#1a1a1a]"
                  />
                </div>

                {error && (
                  <p className="font-sans text-xs text-[#c0392b]">{error}</p>
                )}
              </div>
            </>
          )}

          {/* Success Screen */}
          {step === 2 && (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-emerald-50">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </div>
              <h3 className="font-sans text-xl font-medium text-[#1a1a1a]">
                Request Received
              </h3>
              <p className="mx-auto mt-3 max-w-[340px] font-sans text-sm leading-relaxed text-[#808080]">
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

        {/* Footer */}
        {step === 1 && (
          <div className="flex items-center justify-between border-t border-[#e5e5e5] px-7 py-4">
            <button
              onClick={onClose}
              className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-[#414141] transition hover:text-[#663f29]"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-8 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#663f29] disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit"} <span aria-hidden>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, ...props }) {
  return (
    <div>
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