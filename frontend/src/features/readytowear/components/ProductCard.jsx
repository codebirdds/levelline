import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "../../../components/animation";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function ProductCard({ product, delay = 0 }) {
  const name = product.displayName || product.name || product.title;

  // ✅ Get images ONLY from the first variant
  const firstVariant = product.variants?.[0];
  let allImages = [];

  if (Array.isArray(firstVariant?.images) && firstVariant.images.length > 0) {
    allImages = firstVariant.images
      .map((img) => (typeof img === "string" ? img : img.url))
      .filter(Boolean);
  } else if (Array.isArray(product.images)) {
    // Fallback to product images if variant has none
    allImages = product.images
      .map((img) => (typeof img === "string" ? img : img.url))
      .filter(Boolean);
  } else if (product.image) {
    allImages = [product.image];
  }

  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // ✅ Auto-slide only on hover
  useEffect(() => {
    if (!isHovered || allImages.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % allImages.length);
    }, 1500); // Slides every 1.5 seconds

    return () => clearInterval(interval);
  }, [isHovered, allImages.length]);

  // Reset to the first image when mouse leaves
  useEffect(() => {
    if (!isHovered) setIndex(0);
  }, [isHovered]);

  const basePrice = product.displayPrice;
  const discountAmt = product.displayDiscount;
  const price = discountAmt > 0 ? Math.max(basePrice - discountAmt, 0) : basePrice;

  const to = `/ready-to-wear/${product.slug || product.id}`;

  return (
    <Reveal as="article" delay={delay} duration={800} distance={28} className="group">
      <Link
        to={to}
        state={{ product }}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F1E9] p-3 sm:p-4">
          <div className="relative h-full w-full">
            {allImages.length === 0 ? (
              <div className="absolute inset-0 size-full bg-bg" />
            ) : (
              allImages.map((src, i) => (
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
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <h3 className="line-clamp-1 font-sans text-[13px] font-medium text-[#808080] lg:text-sm">
            {name}
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="font-sans text-[13px] font-bold text-[#414141] lg:text-sm">
              {formatCurrency(price)}
            </p>
            {discountAmt > 0 && (
              <span className="font-sans text-[11px] text-[#808080] line-through">
                {formatCurrency(basePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Reveal>
  );
}