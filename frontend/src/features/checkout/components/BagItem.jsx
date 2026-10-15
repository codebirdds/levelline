import { useDispatch } from "react-redux";
import { updateCartThunk, removeCartThunk } from "../../cart/cartSlice";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function BagItem({ item }) {
  const dispatch = useDispatch();
  const product = item.product || {};
  const variant = item.variant || {};
  const image = (Array.isArray(variant.images) ? variant.images : []).find?.(i => i.is_primary) || (Array.isArray(variant.images) ? variant.images : [])[0] || variant.images?.[0] || "";
  const title = product.name || item.product?.name || "Product";
  const price = item.unit_price || Number(product.discount_price ?? product.price ?? 0);
  const mrp = Number(product.price ?? 0);
  const qty = item.quantity ?? item.qty ?? 1;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const dec = () => dispatch(updateCartThunk({ id: item.id, quantity: Math.max(1, qty - 1) }));
  const inc = () => dispatch(updateCartThunk({ id: item.id, quantity: qty + 1 }));

  return (
    <div className="relative border border-border bg-white p-4 lg:p-5">
      <button
        onClick={() => dispatch(removeCartThunk(item.id))}
        aria-label="Remove item"
        className="absolute right-3 top-3 text-[#414141] transition hover:text-[#663f29]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className="flex gap-4">
        <div className="aspect-[3/4] w-24 shrink-0 overflow-hidden bg-[#F5F1E9] sm:w-28 lg:w-32">
          <img src={image?.url || image} alt={title} className="size-full object-contain" />
        </div>

        <div className="min-w-0 flex-1 pr-6">
          <h3 className="font-sans text-sm font-medium uppercase text-[#414141] lg:text-base">
            {title}
          </h3>

          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="font-sans text-base font-bold text-[#414141]">
              {formatCurrency(price)}
            </span>
            {discount > 0 && (
              <>
                <span className="font-sans text-sm text-[#808080] line-through">
                  {formatCurrency(mrp)}
                </span>
                <span className="font-sans text-sm font-medium text-[#c0392b]">
                  {discount}% Off
                </span>
              </>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                defaultValue={item.size}
                className="h-9 appearance-none border border-border bg-white pl-3 pr-7 font-sans text-sm text-[#414141] focus:border-ink focus:outline-none"
              >
                <option value={item.size}>Size {item.size}</option>
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#414141]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </span>
            </div>

            <div className="inline-flex h-9 items-center border border-border bg-white">
              <button
                onClick={dec}
                disabled={qty <= 1}
                className="flex h-full w-9 items-center justify-center font-sans text-base text-[#414141] transition hover:bg-[#F5F1E9] disabled:cursor-not-allowed disabled:opacity-40"
              >−</button>
              <span className="flex h-full min-w-[36px] items-center justify-center border-x border-border px-2 font-sans text-sm text-[#414141]">
                {qty}
              </span>
              <button
                onClick={inc}
                className="flex h-full w-9 items-center justify-center font-sans text-base text-[#414141] transition hover:bg-[#F5F1E9]"
              >+</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
