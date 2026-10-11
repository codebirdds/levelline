import { useDispatch } from "react-redux";
import { removeItem, updateQty } from "../checkoutSlice";
import { formatCurrency } from "../../../utils/formatCurrency";
import { DELIVERY_NOTE, RETURN_NOTE } from "../constants";

const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 3h13v13H1zM14 8h4l3 3v5h-7zM5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  </svg>
);

const ReturnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 4v6h6M3.5 15a9 9 0 1 0 2.1-9.4L1 10" />
  </svg>
);

export default function BagItem({ item }) {
  const dispatch = useDispatch();
  const discount = item.mrp && item.mrp > item.price
    ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
    : 0;

  const dec = () =>
    dispatch(updateQty({ id: item.id, size: item.size, qty: item.qty - 1 }));

  const inc = () =>
    dispatch(updateQty({ id: item.id, size: item.size, qty: item.qty + 1 }));

  return (
    <div className="relative border border-border bg-white p-4 lg:p-5">
      {/* Remove */}
      <button
        onClick={() => dispatch(removeItem({ id: item.id, size: item.size }))}
        aria-label="Remove item"
        className="absolute right-3 top-3 text-[#414141] transition hover:text-[#663f29]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className="flex gap-4">
        {/* Image */}
        <div className="aspect-[3/4] w-24 shrink-0 overflow-hidden bg-[#F5F1E9] sm:w-28 lg:w-32">
          <img src={item.image} alt={item.title} className="size-full object-contain" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1 pr-6">
          <h3 className="font-sans text-sm font-medium uppercase text-[#414141] lg:text-base">
            {item.title}
          </h3>

          {/* Price row */}
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="font-sans text-base font-bold text-[#414141]">
              {formatCurrency(item.price)}
            </span>
            {discount > 0 && (
              <>
                <span className="font-sans text-sm text-[#808080] line-through">
                  {formatCurrency(item.mrp)}
                </span>
                <span className="font-sans text-sm font-medium text-[#c0392b]">
                  {discount}% Off
                </span>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {/* Size (still a select) */}
            <div className="relative">
              <select
                value={item.size}
                onChange={(e) =>
                  dispatch(updateQty({ id: item.id, size: item.size, qty: item.qty }))
                }
                className="h-9 appearance-none border border-border bg-white pl-3 pr-7 font-sans text-sm text-[#414141] focus:border-ink focus:outline-none"
              >
                <option value={item.size}>Size {item.size}</option>
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#414141]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </span>
            </div>

            {/* Qty stepper */}
            <div className="inline-flex h-9 items-center border border-border bg-white">
              <button
                onClick={dec}
                disabled={item.qty <= 1}
                aria-label="Decrease quantity"
                className="flex h-full w-9 items-center justify-center font-sans text-base text-[#414141] transition hover:bg-[#F5F1E9] disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>
              <span className="flex h-full min-w-[36px] items-center justify-center border-x border-border px-2 font-sans text-sm text-[#414141]">
                {item.qty}
              </span>
              <button
                onClick={inc}
                aria-label="Increase quantity"
                className="flex h-full w-9 items-center justify-center font-sans text-base text-[#414141] transition hover:bg-[#F5F1E9]"
              >
                +
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-sans text-xs text-[#414141]">
            <span className="inline-flex items-center gap-1.5">
              <TruckIcon /> {DELIVERY_NOTE}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ReturnIcon /> {RETURN_NOTE}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}