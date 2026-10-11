import PillButton from "../../../components/common/PillButton";
import fabric from "../Assets/fabric.png";
export default function FabricBanner() {
  return (
    <section id="fabrics" className="relative isolate overflow-hidden bg-ink h-screen my-10">
      <img src={fabric} alt="" loading="lazy" className="absolute inset-0 -z-10 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-ink/20" />
      <div className="h-screen flex flex-col items-center justify-center text-center text-cream">
        <p className="font-sans text-sm lg:text-sm">The Foundation of Exceptional Tailoring</p>
        <h2 className="mt-4 max-w-4xl font-sansfont-medium uppercase leading-snug text-3xl lg:text-4xl">
          Curated from the world’s finest fabrics
        </h2>
        <p className="mt-6 max-w-3xl font-sans text-sm leading-relaxed lg:mt-8 lg:text-sm">
          Woven with precision by legendary Italian and global houses, our hand-selected wools,
          cashmeres, and silks offer an extraordinary drape and effortless comfort.
        </p>
        <PillButton variant="light" className="mt-8 lg:mt-12">Explore Fabrics</PillButton>
      </div>
    </section>
  );
}
