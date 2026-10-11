import ProductCard from "./ProductCard";
import { ImageReveal } from "../../../components/animation";
import { EDITORIALS } from "../content";

const gridCls = "grid grid-cols-2 content-start gap-x-1.5 gap-y-8 lg:gap-y-10";

const Cards = ({ items, cols = 4 }) =>
  items.map((p, i) => <ProductCard key={p.id} product={p} delay={(i % cols) * 90} />);

const Editorial = ({ src }) => (
  <ImageReveal variant="zoom" className="aspect-[4/5] bg-tile lg:aspect-auto lg:h-full">
    <img src={src} alt="Levelline ready-to-wear editorial" loading="lazy" className="size-full object-cover" />
  </ImageReveal>
);

/** 2 products-per-row 2x2 half + a tall editorial image, like the Figma. */
const FeatureBlock = ({ items, image, imageFirst }) => (
  <div className="grid gap-y-8 lg:grid-cols-2 lg:gap-x-1.5">
    {imageFirst && <Editorial src={image} />}
    <div className={gridCls}>
      <Cards items={items} cols={2} />
    </div>
    {!imageFirst && <Editorial src={image} />}
  </div>
);

export default function ProductGrid({ products, editorial }) {
  if (!products?.length) {
    return (
      <p className="px-4 py-24 text-center font-sans text-base text-subheading lg:text-xl">
        No pieces in this category yet — check back soon.
      </p>
    );
  }

  // Filtered / sorted view => plain grid. "ALL" => editorial layout from the design.
  if (!editorial) {
    return (
      <div className="grid grid-cols-2 gap-x-1.5 gap-y-8 px-4 lg:grid-cols-4 lg:gap-y-10">
        <Cards items={products} />
      </div>
    );
  }

  const a = products.slice(0, 8);
  const b = products.slice(8, 12);
  const c = products.slice(12, 16);
  const rest = products.slice(16);

  return (
    <div className="space-y-8 px-4 lg:space-y-10">
      <div className="grid grid-cols-2 gap-x-1.5 gap-y-8 lg:grid-cols-4 lg:gap-y-10">
        <Cards items={a} />
      </div>
      {b.length > 0 && <FeatureBlock items={b} image={EDITORIALS[0]} imageFirst />}
      {c.length > 0 && <FeatureBlock items={c} image={EDITORIALS[1]} />}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-x-1.5 gap-y-8 lg:grid-cols-4 lg:gap-y-10">
          <Cards items={rest} />
        </div>
      )}
    </div>
  );
}
