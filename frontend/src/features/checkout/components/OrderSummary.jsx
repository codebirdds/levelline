import { useSelector } from "react-redux";
import { selectCartItems } from "../../cart/cartSlice";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function OrderSummary({ confirmation = false }) {
  const items = useSelector(selectCartItems);
  const subtotal = items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
  const count = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return (
    <div className="border border-border bg-white">
      <div className="border-b border-border p-4 lg:p-5">
        <h2 className="font-sans text-base font-medium text-[#414141] lg:text-lg">Order summary ({count} {count === 1 ? "item" : "items"})</h2>
      </div>
      <div className="space-y-3 p-4 lg:p-5">
        <Row label="Items total" value={formatCurrency(subtotal)} />
      </div>
      <div className="border-t border-border p-4 lg:p-5">
        <div className="flex items-center justify-between">
          <span className="font-sans text-base font-medium text-[#414141]">Estimated total</span>
          <span className="font-sans text-base font-bold text-[#414141]">{formatCurrency(subtotal)}</span>
        </div>
        {confirmation && <p className="mt-2 text-xs text-[#808080]">Final total is calculated by the server when the order is placed.</p>}
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
