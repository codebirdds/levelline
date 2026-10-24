import { formatCurrency } from "../../../../utils/formatCurrency";

// Helper to extract and normalize images (handles both string and object formats)
const getProductImages = (p) => {
  const rawImages = p.is_outfit 
    ? (p.images || []) 
    : (p.variants?.[0]?.images || []);
    
  return rawImages
    .map(img => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);
};

export default function ProductTable({ items, onEdit, onDelete, onManageVariants }) {
  if (!items.length) {
    return <p className="text-sm text-muted p-6 text-center">No products yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Variants</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => {
            const variants = p.variants || [];
            
            // Total stock logic
            const totalStock = variants.reduce(
              (sum, v) => sum + (v.sizes || []).reduce((s, sz) => s + (sz.stock || 0), 0),
              0
            );

            // Colors logic
            const colors = variants.map((v) => v.color).filter(Boolean);

            // Images logic
            const images = getProductImages(p);
            const primaryImg = images[0] || null;
            const extraImagesCount = images.length - 1;

            // Price logic (outfit uses p.price, normal uses first variant's price)
            const base = p.is_outfit ? Number(p.price) : Number(variants[0]?.price || 0);
            const discount = p.is_outfit ? Number(p.discount_price) : Number(variants[0]?.discount_price || 0);
            
            const finalPrice = discount > 0 ? Math.max(base - discount, 0) : base;
            const hasDiscount = discount > 0 && base > 0;
            const priceLabel = p.is_outfit ? "Outfit Price" : (variants.length > 1 ? "Starting at" : "Variant Price");

            return (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-hover">
                {/* Product (with Images) */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {primaryImg ? (
                        <img
                          src={primaryImg}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded bg-bg border border-border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-bg border border-border" />
                      )}
                      {extraImagesCount > 0 && (
                        <span className="absolute -bottom-1 -right-1 bg-black text-white text-[9px] font-bold px-1 rounded-sm">
                          +{extraImagesCount}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-ink line-clamp-1 max-w-[260px]">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {p.brand && <p className="text-xs text-muted">{p.brand}</p>}
                        {p.is_outfit && <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Outfit</span>}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3 text-muted capitalize">{p.category?.name || "—"}</td>

                {/* Price */}
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted mb-0.5">{priceLabel}</span>
                    <span className="font-medium text-ink">
                      {formatCurrency(finalPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-subtle line-through">
                        {formatCurrency(base)}
                      </span>
                    )}
                  </div>
                </td>

                {/* Variants */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => onManageVariants(p)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                  >
                    {variants.length} variant{variants.length !== 1 && "s"}
                    {colors.length > 0 && (
                      <span className="text-muted font-normal">({colors.join(", ")})</span>
                    )}
                  </button>
                </td>

                {/* Stock */}
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      totalStock > 10
                        ? "bg-brand-soft text-brand"
                        : totalStock > 0
                        ? "bg-amber-50 text-amber-600"
                        : "bg-red-50 text-danger"
                    }`}
                  >
                    {totalStock} in stock
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => onEdit(p)} className="text-xs font-semibold text-brand hover:underline mr-3">
                    Edit
                  </button>
                  <button onClick={() => onManageVariants(p)} className="text-xs font-semibold text-ink hover:underline mr-3">
                    View Variants
                  </button>
                  <button onClick={() => onDelete(p)} className="text-xs font-semibold text-danger hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}