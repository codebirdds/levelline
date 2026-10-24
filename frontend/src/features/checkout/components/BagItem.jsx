import { useDispatch } from "react-redux";
import { updateCartThunk, removeCartThunk } from "../../cart/cartSlice";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function BagItem({ item }) {
  const dispatch = useDispatch();
  
  const product = item.product || {};
  const variant = item.variant || {};
  
  // Title & Description
  const title = variant.name || product.name || "Product";
  const description = variant.description || product.description || "";

  // Image
  let image = "";
  if (Array.isArray(variant.images) && variant.images.length > 0) {
    const primary = variant.images.find(i => i.is_primary) || variant.images[0];
    image = typeof primary === "string" ? primary : primary.url;
  } else if (Array.isArray(product.images) && product.images.length > 0) {
    const primary = product.images[0];
    image = typeof primary === "string" ? primary : primary.url;
  }

  // Variant Details
  const color = variant.color || item.color;
  const colorCode = variant.color_code || item.color_code || "#ccc";
  const size = item.size;
  const selectedSizeObj = Array.isArray(variant.sizes) ? variant.sizes.find(s => s.size === size) : null;
  const sku = item.sku || selectedSizeObj?.sku;

  // Pricing
  const basePrice = Number(variant.price) || Number(product.price) || 0;
  const discountAmt = Number(variant.discount_price) || Number(product.discount_price) || 0;
  const finalPrice = Math.max(basePrice - discountAmt, 0);
  const originalPrice = basePrice;
  const discountPercent = originalPrice > finalPrice 
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) 
    : 0;

  const qty = Number(item.quantity) || 1;

  const dec = () => dispatch(updateCartThunk({ id: item.id, quantity: Math.max(1, qty - 1) }));
  const inc = () => dispatch(updateCartThunk({ id: item.id, quantity: qty + 1 }));

  return (
    <div className="relative border border-border bg-white p-3 lg:p-4">
      {/* Remove Button */}
      <button
        onClick={() => dispatch(removeCartThunk(item.id))}
        aria-label="Remove item"
        className="absolute right-2.5 top-2.5 text-[#808080] transition hover:text-[#c0392b]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className="flex gap-3">
        {/* Smaller Product Image */}
        <div className="aspect-[3/4] w-16 shrink-0 overflow-hidden bg-[#F5F1E9] sm:w-20">
          {image ? (
            <img src={image} alt={title} className="size-full object-contain" />
          ) : (
            <div className="grid size-full place-items-center text-[9px] text-[#808080]">No Image</div>
          )}
        </div>

        <div className="min-w-0 flex-1 pr-4">
          {/* Smaller Title */}
          <h3 className="font-sans text-[11px] font-medium uppercase tracking-wide text-[#414141] lg:text-xs">
            {title}
          </h3>

          {description && (
            <p className="mt-0.5 font-sans text-[10px] text-[#808080] line-clamp-1">
              {description}
            </p>
          )}

          {/* Meta Row - Smaller text */}
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-[#808080]">
            {color && (
              <span className="flex items-center gap-1">
                <span className="size-2.5 rounded-full border border-border" style={{ backgroundColor: colorCode }} />
                {color}
              </span>
            )}

            {size && (
              <span className="border border-border px-1 py-0.5 rounded bg-gray-50">
                Size: <span className="font-medium text-[#414141]">{size}</span>
              </span>
            )}

            {sku && <span className="font-mono text-[9px]">SKU: {sku}</span>}
          </div>

          {/* Price Row - Smaller text */}
          <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
            <span className="font-sans text-xs font-bold text-[#414141] lg:text-sm">
              {formatCurrency(finalPrice)}
            </span>
            {originalPrice > finalPrice && (
              <>
                <span className="font-sans text-[10px] text-[#808080] line-through">
                  {formatCurrency(originalPrice)}
                </span>
                <span className="font-sans text-[10px] font-medium text-emerald-700">
                  {discountPercent}% Off
                </span>
              </>
            )}
          </div>

          {/* Smaller Quantity */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <div className="inline-flex h-7 items-center border border-border bg-white">
              <button
                onClick={dec}
                disabled={qty <= 1}
                className="flex h-full w-7 items-center justify-center font-sans text-sm text-[#414141] transition hover:bg-[#F5F1E9] disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>
              <span className="flex h-full min-w-[28px] items-center justify-center border-x border-border px-1 font-sans text-[11px] text-[#414141]">
                {qty}
              </span>
              <button
                onClick={inc}
                className="flex h-full w-7 items-center justify-center font-sans text-sm text-[#414141] transition hover:bg-[#F5F1E9]"
              >
                +
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}