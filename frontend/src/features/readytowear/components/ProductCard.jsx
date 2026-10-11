import { Link } from "react-router-dom";
import { Reveal } from "../../../components/animation";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function ProductCard({ product, delay = 0 }) {
  return (
    <Reveal as="article" delay={delay} duration={800} distance={28} className="group">
      <Link to={`/ready-to-wear/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F1E9]">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="absolute inset-0 size-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        <h3 className="mt-3 font-sans text-base font-medium text-[#808080] lg:text-sm">
          {product.title}
        </h3>
        <p className="mt-1 font-sans text-base font-bold text-[#414141] lg:text-sm">
          {formatCurrency(product.price)}
        </p>
      </Link>
    </Reveal>
  );
}