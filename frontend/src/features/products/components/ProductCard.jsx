import { useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "../../../components/animation";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function ProductCard({ product, delay = 0 }) {
  const [index, setIndex] = useState(0);

  const name = product.name || product.title;

  // Use normalized fields from the Grid
  const images = [product.displayImage].filter(Boolean); 
  const total = images.length;
  
  const basePrice = product.displayPrice;
  const discountAmt = product.displayDiscount;
  const price = discountAmt > 0 ? Math.max(basePrice - discountAmt, 0) : basePrice;

  const to = `/ready-to-wear/${product.slug || product.id}`;

  return (
    <Reveal as="article" delay={delay} duration={800} distance={28} className="group">
      <Link to={to} state={{ product }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F1E9] p-3 sm:p-4">
          <div className="relative h-full w-full flex items-center justify-center">
            {total === 0 ? (
              <div className="absolute inset-0 size-full bg-bg" />
            ) : (
              images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={name}
                  loading="lazy"
                  className="absolute inset-0 size-full object-contain"
                />
              ))
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <h3 className="line-clamp-1 font-sans text-[13px] font-medium text-[#808080] lg:text-sm">
            {name} {product.type === "variant" && product.variant?.color ? `- ${product.variant.color}` : ""}
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