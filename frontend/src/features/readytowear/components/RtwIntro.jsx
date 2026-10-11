import SectionHeading from "../../../components/common/SectionHeading";
import { Reveal } from "../../../components/animation";
import { RTW_INTRO } from "../content";

export default function RtwIntro() {
  return (
    <section className="container-x  pt-20 pb-20 ">
      <Reveal>
        <SectionHeading
          align="center"
          title={RTW_INTRO.title}
          subtitle={RTW_INTRO.text}
          subtitleWidth="max-w-4xl"
        />
      </Reveal>
    </section>
  );
}