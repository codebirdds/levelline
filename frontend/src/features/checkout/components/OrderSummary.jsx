import { useSelector } from "react-redux";
import { selectCartItems } from "../../cart/cartSlice";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function OrderSummary({ 
  confirmation = false, 
  confirmed = false, 
  setConfirmed = () => {} 
}) {
  const items = useSelector(selectCartItems) || [];
  
  const subtotal = items.reduce((sum, item) => {
    const product = item.product || {};
    const variant = item.variant || {};
    const basePrice = Number(variant.price) || Number(product.price) || 0;
    const discountAmt = Number(variant.discount_price) || Number(product.discount_price) || 0;
    const finalPrice = Math.max(basePrice - discountAmt, 0);
    return sum + (finalPrice * Number(item.quantity || 1));
  }, 0);

  const count = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return (
    <div className="border border-border bg-white">
      <div className="border-b border-border p-3 lg:p-4">
        <h2 className="font-sans text-xs font-medium uppercase tracking-wide text-[#414141] lg:text-sm">
          Order summary ({count} {count === 1 ? "item" : "items"})
        </h2>
      </div>
      
      <div className="space-y-2 p-3 lg:p-4">
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs text-[#414141]">Items total</span>
          <span className="font-sans text-xs text-[#414141]">{formatCurrency(subtotal)}</span>
        </div>
      </div>
      
      <div className="border-t border-border p-3 lg:p-4">
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm font-medium text-[#414141]">Estimated total</span>
          <span className="font-sans text-sm font-bold text-[#414141]">{formatCurrency(subtotal)}</span>
        </div>
        
        {confirmation && (
          <div className="mt-3 border-t border-border pt-3">
            <label className="flex cursor-pointer items-start gap-2 text-[11px] text-[#414141]">
              <input 
                type="checkbox" 
                checked={confirmed} 
                onChange={(event) => setConfirmed(event.target.checked)} 
                className="mt-0.5 accent-[#663f29]" 
              />
              <span>I confirm these cart items and quantities.</span>
            </label>
            <p className="mt-1 text-[10px] text-[#808080]">
              Final total is calculated by the server when the order is placed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}