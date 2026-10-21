import { useSelector } from "react-redux";
import { selectCartItems } from "../../cart/cartSlice";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function OrderSummary({ 
  confirmation = false, 
  confirmed = false, 
  setConfirmed = () => {} 
}) {
  const items = useSelector(selectCartItems);
  const subtotal = items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
  const count = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return (
    <div className="border border-border bg-white">
      <div className="border-b border-border p-4 lg:p-5">
        <h2 className="font-sans text-base font-medium text-[#414141] lg:text-lg">
          Order summary ({count} {count === 1 ? "item" : "items"})
        </h2>
      </div>
      
      <div className="space-y-3 p-4 lg:p-5">
        <Row label="Items total" value={formatCurrency(subtotal)} />
      </div>
      
      <div className="border-t border-border p-4 lg:p-5">
        <div className="flex items-center justify-between">
          <span className="font-sans text-base font-medium text-[#414141]">Estimated total</span>
          <span className="font-sans text-base font-bold text-[#414141]">{formatCurrency(subtotal)}</span>
        </div>
        
        {/* Confirmation Checkbox moved here */}
        {confirmation && (
          <div className="mt-4 border-t border-border pt-4">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-[#414141]">
              <input 
                type="checkbox" 
                checked={confirmed} 
                onChange={(event) => setConfirmed(event.target.checked)} 
                className="mt-1 accent-[#663f29]" 
              />
              <span>I confirm these cart items and quantities.</span>
            </label>
            <p className="mt-2 text-xs text-[#808080]">
              Final total is calculated by the server when the order is placed.
            </p>
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