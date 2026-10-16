import { useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "../../../components/animation";
import { formatCurrency } from "../../../utils/formatCurrency";

const getImages = (product) => {
  const v = product?.variants?.[0];
  if (v?.images?.length) {
    return v.images
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((i) => i.url)
      .filter(Boolean);
  }
  if (product?.images?.length) {
    return product.images
      .map((i) => (typeof i === "string" ? i : i.url))
      .filter(Boolean);
  }
  return product?.image ? [product.image] : [];
};

export default function ProductCard({ product, delay = 0 }) {
  const images = getImages(product);
  const total = images.length;
  const [index, setIndex] = useState(0);

  const name = product.name || product.title;

  // Final price = price − discount_price
  const basePrice = Number(product.price) || 0;
  const discountAmt = Number(product.discount_price) || 0;
  const price =
    discountAmt > 0 ? Math.max(basePrice - discountAmt, 0) : basePrice;

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const next = (e) => {
    stop(e);
    setIndex((i) => (i + 1) % total);
  };
  const prev = (e) => {
    stop(e);
    setIndex((i) => (i - 1 + total) % total);
  };

  const to = `/ready-to-wear/${product.slug || product.id}`;

  return (
    <Reveal as="article" delay={delay} duration={800} distance={28} className="group">
      <Link to={to} state={{ product }} className="block">
        {/* Image tile — smaller padding, tighter aspect */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F1E9] p-3 sm:p-4">
          <div className="relative h-full w-full">
            {total === 0 ? (
              <div className="absolute inset-0 size-full" />
            ) : (
              images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={name}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 size-full object-contain transition-opacity duration-700 ease-out ${
                    i === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))
            )}

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous image"
                  className="absolute left-1 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[#414141] opacity-0 transition group-hover:opacity-100"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next image"
                  className="absolute right-1 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[#414141] opacity-0 transition group-hover:opacity-100"
                >
                  ›
                </button>

                <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        stop(e);
                        setIndex(i);
                      }}
                      aria-label={`View image ${i + 1}`}
                      className={`size-1 rounded-full transition ${
                        i === index ? "bg-[#414141]" : "bg-[#414141]/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Meta — tighter spacing + smaller type */}
        <h3 className="mt-2 line-clamp-1 font-sans text-[13px] font-medium text-[#808080] lg:text-sm">
          {name}
        </h3>
        <p className="mt-0.5 font-sans text-[13px] font-bold text-[#414141] lg:text-sm">
          {formatCurrency(price)}
        </p>
      </Link>
    </Reveal>
  );
}