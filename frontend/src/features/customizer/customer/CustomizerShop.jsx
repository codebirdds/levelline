import { Link, useSearchParams } from "react-router-dom";
import GarmentCanvas from "../components/GarmentCanvas.jsx";
import SectionHeading from "../../../components/common/SectionHeading";
import { Reveal } from "../../../components/animation";
import { TYPE } from "../../../components/common/typography";
import { formatCurrency } from "../../../utils/formatCurrency";
import { resolveGarment } from "../engine/configurationResolver.js";
import { getPublished, listPublishedProducts } from "../storage/productStorage.js";
import { useStored } from "../hooks/useStorage.js";

export default function CustomizerShop() {
  const all = useStored(listPublishedProducts);
  const category = useSearchParams()[0].get("category");
  const products = category ? all.filter((p) => p.category.toLowerCase() === category.toLowerCase()) : all;
  return (
    <main className="min-h-screen bg-page px-5 pb-20 pt-10 sm:px-10 lg:px-[5%]">
      <SectionHeading align="left" title="Design your garment" subtitle="Choose a piece, then tailor every detail — collar, cuffs, pockets and more — and watch it update live." />
      {products.length === 0 ? (
        <p className={`mt-16 text-center ${TYPE.p}`}>{category ? `No ${category} are available to customise yet.` : "No customizable garments are published yet. Please check back soon."}</p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((p, i) => {
            const v = getPublished(p.id);
            return (
              <Reveal as="li" key={p.id} delay={(i % 4) * 90}>
                <Link to={`/customize/${p.id}`} className="group block">
                  <div className="rounded-sm bg-tile p-4 transition-shadow group-hover:shadow-md">
                    <GarmentCanvas canvas={v.template.canvas} nodes={resolveGarment(v.template, {}).nodes} className="w-full transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <h3 className={`mt-3 ${TYPE.h3}`}>{p.name}</h3>
                  <p className={TYPE.bold}>From {formatCurrency(p.basePrice)}</p>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      )}
    </main>
  );
}
