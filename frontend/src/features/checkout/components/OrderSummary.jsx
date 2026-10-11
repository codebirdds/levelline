import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCheckoutCoupon, selectCheckoutItems, applyCoupon, removeCoupon } from "../checkoutSlice";
import { COUPONS } from "../constants";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function OrderSummary() {
  const items = useSelector(selectCheckoutItems);
  const coupon = useSelector(selectCheckoutCoupon);
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const orderValue = items.reduce((sum, i) => sum + (i.mrp || i.price) * i.qty, 0);
  const productDiscount = items.reduce(
    (sum, i) => sum + ((i.mrp || i.price) - i.price) * i.qty,
    0
  );
  const subtotal = orderValue - productDiscount;
  const couponDiscount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const grandTotal = subtotal - couponDiscount;
  const overallSavings = productDiscount + couponDiscount;

  const handleApply = () => {
    const clean = code.trim().toUpperCase();
    if (COUPONS[clean]) {
      dispatch(applyCoupon(COUPONS[clean]));
      setError("");
      setCode("");
    } else {
      setError("Invalid coupon code");
    }
  };

  return (
    <div className="border border-border bg-white">
      <div className="border-b border-border p-4 lg:p-5">
        <h2 className="font-sans text-base font-medium text-[#414141] lg:text-lg">
          Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
        </h2>
      </div>

      <div className="space-y-3 p-4 lg:p-5">
        <Row label="Order Value" value={formatCurrency(orderValue)} />
        {productDiscount > 0 && (
          <Row label="Product Discount" value={`- ${formatCurrency(productDiscount)}`} />
        )}
        <div>
          {coupon ? (
            <div className="flex items-center justify-between text-sm">
              <span className="font-sans text-[#2f8f3e]">
                {coupon.code} applied ({coupon.percent}% off)
              </span>
              <button
                onClick={() => dispatch(removeCoupon())}
                className="font-sans text-xs text-[#c0392b] underline underline-offset-2"
              >
                Remove
              </button>
            </div>
          ) : (
            <p className="font-sans text-sm text-[#2f8f3e]">Best Coupon Available</p>
          )}
        </div>

        {/* Coupon input */}
        {!coupon && (
          <>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(""); }}
                placeholder="ADD10OFF"
                className="h-10 flex-1 border border-dashed border-border bg-white px-3 font-sans text-sm text-[#414141] outline-none placeholder:text-[#b0b0b0] focus:border-ink"
              />
              <button
                onClick={handleApply}
                className="h-10 border border-[#414141] px-4 font-sans text-xs font-medium uppercase tracking-wide text-[#414141] transition hover:bg-[#414141] hover:text-white"
              >
                Apply
              </button>
            </div>
            {error && (
              <p className="font-sans text-xs text-[#c0392b]">{error}</p>
            )}
            <p className="font-sans text-xs text-[#808080]">
              Get 10% off on first purchase
            </p>
            <button className="font-sans text-xs text-[#414141] underline underline-offset-2">
              View full Terms and Conditions
            </button>
          </>
        )}
      </div>

      <div className="border-t border-border p-4 lg:p-5">
        <div className="flex items-center justify-between">
          <span className="font-sans text-base font-medium text-[#414141]">Grand Total</span>
          <span className="font-sans text-base font-bold text-[#414141]">
            {formatCurrency(grandTotal)}
          </span>
        </div>
        {overallSavings > 0 && (
          <div className="mt-1 flex items-center justify-between">
            <span className="font-sans text-xs text-[#2f8f3e]">Overall savings</span>
            <span className="font-sans text-xs text-[#2f8f3e]">
              {formatCurrency(overallSavings)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="font-sans text-sm text-[#414141]">{label}</span>
    <span className="font-sans text-sm text-[#414141]">{value}</span>
  </div>
);