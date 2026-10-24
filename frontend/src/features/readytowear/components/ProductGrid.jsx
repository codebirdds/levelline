import ProductCard from "./ProductCard";
import { ImageReveal } from "../../../components/animation";
import { Link } from "react-router-dom";

const gridCls = "grid grid-cols-2 content-start gap-x-1.5 gap-y-8 lg:gap-y-10";

const Cards = ({ items, cols = 4 }) =>
  items.map((p, i) => <ProductCard key={p.displayKey || p.id} product={p} delay={(i % cols) * 90} />);

const Editorial = ({ src, outfit }) => (
  <Link to={`/ready-to-wear/${outfit.slug || outfit.id}`} state={{ product: outfit }} className="group block h-full">
    <ImageReveal variant="zoom" className="aspect-[4/5] bg-tile lg:aspect-auto lg:h-full">
      <div className="relative size-full overflow-hidden">
        <img 
          src={src} 
          alt={outfit.name} 
          loading="lazy" 
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end justify-center p-6">
          <span className="bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black">
            Shop Full Outfit
          </span>
        </div>
      </div>
    </ImageReveal>
  </Link>
);

const FeatureBlock = ({ outfit, items }) => (
  <div className="grid gap-y-8 lg:grid-cols-2 lg:gap-x-1.5">
    <Editorial src={outfit.images?.[0]?.url || outfit.images?.[0]} outfit={outfit} />
    <div className={gridCls}>
      <Cards items={items} cols={2} />
    </div>
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

  const outfits = products.filter((p) => p.is_outfit);
  const regulars = products.filter((p) => !p.is_outfit);

  // ✅ FIX: Map over regular products (only 1 card per product)
  const regularCards = regulars.map((p) => {
    // Find the lowest price among variants for the display
    const variantPrices = (p.variants || []).map(
      (v) => Math.max(Number(v.price) - Number(v.discount_price || 0), 0)
    );
    const minVariantPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : Number(p.price);

    return {
      ...p,
      displayKey: `product-${p.id}`,
      displayName: p.name,
      displayPrice: minVariantPrice,
      type: "product", // Treat as single product card
    };
  });

  // If not editorial (e.g. filtered), show regulars first then outfits
  if (!editorial) {
    const allCards = [
      ...regularCards,
      ...outfits.map(o => ({
        ...o,
        displayKey: `outfit-${o.id}`,
        displayName: o.name,
        displayImage: o.images?.[0]?.url || o.images?.[0] || "",
        displayPrice: Number(o.price) || 0,
        displayDiscount: Number(o.discount_price) || 0,
        type: "outfit",
      }))
    ];

    return (
      <div className="grid grid-cols-2 gap-x-1.5 gap-y-8 px-4 lg:grid-cols-4 lg:gap-y-10">
        <Cards items={allCards} />
      </div>
    );
  }

  // Editorial mode logic: Split regulars into first 12 and the rest
  const firstTwelveRegulars = regularCards.slice(0, 12);
  const remainingRegulars = regularCards.slice(12);

  return (
    <div className="space-y-8 px-4 lg:space-y-10">
      
      {/* 1st Section: First 12 Regular Products (if any) */}
      {firstTwelveRegulars.length > 0 && (
        <div className="grid grid-cols-2 gap-x-1.5 gap-y-8 lg:grid-cols-4 lg:gap-y-10">
          <Cards items={firstTwelveRegulars} />
        </div>
      )}

      {/* 2nd Section: Outfits / Editorial Blocks (if any) */}
      {outfits.map((outfit) => {
        const variantCards = (outfit.variants || []).map((v) => ({
          ...outfit,
          displayKey: `${outfit.id}-${v.id}`,
          displayName: v.name || outfit.name,
          displayImage: v.images?.[0]?.url || v.images?.[0] || outfit.images?.[0]?.url || outfit.images?.[0] || "",
          displayPrice: Number(v.price) || Number(outfit.price) || 0,
          displayDiscount: Number(v.discount_price) || Number(outfit.discount_price) || 0,
          type: "variant",
          variant: v,
        }));

        if (!variantCards.length) return null;

        return (
          <FeatureBlock
            key={outfit.id}
            outfit={outfit}
            items={variantCards}
          />
        );
      })}

      {/* 3rd Section: Remaining Regular Products (if any) */}
      {remainingRegulars.length > 0 && (
        <div className="grid grid-cols-2 gap-x-1.5 gap-y-8 lg:grid-cols-4 lg:gap-y-10 mt-10">
          <Cards items={remainingRegulars} />
        </div>
      )}
    </div>
  );
}