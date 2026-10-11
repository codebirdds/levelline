import SectionHeading from "../../../components/common/SectionHeading";
import PillButton from "../../../components/common/PillButton";
import { CUSTOM_COLUMNS } from "../content";

export default function Customization() {
  return (
    <section className="container-x py-10">
      <SectionHeading title="Customization" underline />

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-12">
        {CUSTOM_COLUMNS.map((c) => (
          <div key={c.title}>
            <h3 className="font-sans text-lg font-medium text-[#6b6b6b] lg:text-md">{c.title}</h3>
            <p className="mt-3 font-sans text-sm leading-relaxed text-[#808080]">{c.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center lg:mt-13">
        <PillButton size="sm">Book an appointment</PillButton>
      </div>
    </section>
  );
}
