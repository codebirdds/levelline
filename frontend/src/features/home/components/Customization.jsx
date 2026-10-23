import { useState } from "react";
import SectionHeading from "../../../components/common/SectionHeading";
import PillButton from "../../../components/common/PillButton";
import { Reveal, Stagger } from "../../../components/animation";
import BookAppointmentModal from "../../contact/components/BookAppointmentModal";
import { CUSTOM_COLUMNS } from "../content";

export default function Customization() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <section className="container-x py-10 lg:py-14">
        <Reveal>
          <SectionHeading title="Customization" underline />
        </Reveal>

        <Stagger
          className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-12"
          step={120}
          delay={150}
        >
          {CUSTOM_COLUMNS.map((c) => (
            <div key={c.title}>
              <h3 className="font-sans text-lg font-medium text-[#6b6b6b] lg:text-md">
                {c.title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#808080]">
                {c.text}
              </p>
            </div>
          ))}
        </Stagger>

        <Reveal delay={650}>
          <div className="mt-10 text-center lg:mt-13">
            <PillButton 
              size="sm" 
              onClick={() => setBookingOpen(true)}
            >
              Book an appointment
            </PillButton>
          </div>
        </Reveal>
      </section>

      {/* ✅ Render the same modal here */}
      <BookAppointmentModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}