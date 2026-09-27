import ProductCard from "../../products/components/ProductCard";

export default function ProductSection({ title, products = [] }) {
  if (!products.length) return null;

  return (
    <section className="pt-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-ink">{title}</h2>
        <button className="text-xs font-semibold text-brand hover:underline">
          View all
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}