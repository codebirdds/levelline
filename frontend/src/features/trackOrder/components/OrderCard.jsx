import { formatCurrency } from "../../../utils/formatCurrency";
import OrderTimeline from "./OrderTimeline";

const STATUS_LABEL = {
  pending: "Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const STATUS_STYLE = {
  pending: "bg-[#F5F1E9] text-[#663f29]",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-amber-50 text-amber-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  returned: "bg-red-50 text-red-700",
};

const getItemImage = (item) => {
  if (Array.isArray(item.variant?.images) && item.variant.images.length > 0) {
    const primary = item.variant.images.find((i) => i.is_primary) || item.variant.images[0];
    return typeof primary === "string" ? primary : primary.url || "";
  }
  const imgs = Array.isArray(item.images) ? item.images : [];
  if (imgs.length) {
    const primary = imgs.find((i) => i.is_primary) || imgs[0];
    return typeof primary === "string" ? primary : primary.url || "";
  }
  return item.image || item.image_url || "";
};

const PAYMENT_LABEL = {
  cod: "Cash on delivery",
  online: "Paid online",
  upi: "UPI",
  card: "Card",
};

const CANCELLABLE = ["pending", "confirmed", "processing"];
const TERMINAL = ["delivered", "cancelled", "returned"];

export default function OrderCard({ order, selected, onTrack, onCancel }) {
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const items = Array.isArray(order.items) ? order.items : [];
  const status = order.order_status || "pending";
  const statusLabel = STATUS_LABEL[status] || status;
  const statusCls = STATUS_STYLE[status] || "bg-[#F5F1E9] text-[#663f29]";

  const isDead = status === "cancelled" || status === "returned";
  const isTerminal = TERMINAL.includes(status);
  const canCancel = CANCELLABLE.includes(status);

  let computedSubtotal = 0;
  let computedDiscount = 0;

  const processedItems = items.map((item) => {
    const variant = item.variant || {};
    const product = item.product || {};
    const qty = Number(item.quantity) || 1;
    
    const basePrice = Number(item.unit_price) || Number(variant.price) || Number(product.price) || 0;
    const discountAmt = Number(item.discounted_unit_price) || Number(item.discount_amount) || Number(variant.discount_price) || 0;
    
    const finalPrice = Math.max(basePrice - discountAmt, 0);
    
    computedSubtotal += basePrice * qty;
    computedDiscount += discountAmt * qty;

    return {
      ...item,
      displayName: variant.name || product.name || item.product_name || "Product",
      displayColor: variant.color || item.color,
      displaySize: item.size,
      displaySku: item.sku || (Array.isArray(variant.sizes) ? variant.sizes.find(s => s.size === item.size)?.sku : null),
      basePrice,
      finalPrice,
      lineTotal: finalPrice * qty,
      lineOriginal: basePrice * qty,
      qty,
    };
  });

  const shipping = Number(order.shipping_fee ?? 0);
  const tax = Number(order.tax_amount ?? 0);
  const total = computedSubtotal - computedDiscount + shipping + tax;

  return (
    <article className="border border-border bg-white">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
        
        {/* Left Side: Order Info */}
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#808080]">Order number</p>
          <h2 className="mt-1 font-sans text-sm font-medium text-[#414141]">{order.order_number}</h2>
          <p className="mt-1 text-[11px] text-[#808080]">Placed {date}</p>
        </div>

        {/* Right Side: Status, Price & Payment */}
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span className={`inline-block rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ${statusCls}`}>
            {statusLabel}
          </span>
          <div className="text-left sm:text-right">
            <p className="font-sans text-sm font-semibold text-[#414141]">{formatCurrency(total)}</p>
            <p className="mt-1 text-[10px] uppercase text-[#808080]">
              {PAYMENT_LABEL[order.payment_method] || order.payment_method || ""}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Top Progress Bar (Only if not Delivered/Cancelled/Returned) */}
      {!isTerminal && (
        <div className="border-b border-border bg-[#fafafa] px-4 py-5 sm:px-6">
          <OrderTimeline status={status} />
        </div>
      )}

      {/* ── Body ── */}
      <div className={isTerminal ? "grid gap-5 p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_260px]" : "p-4 sm:p-5"}>
        
        {/* LEFT: items + price summary (Full width if not terminal) */}
        <div>
          <p className="mb-3 text-[10px] uppercase tracking-wide text-[#808080]">Items</p>

          <div className="space-y-3">
            {processedItems.slice(0, 3).map((item, index) => {
              const hasDiscount = item.basePrice > item.finalPrice;
              return (
                <div key={`${item.product_variant_id ?? item.product_id}-${item.size}-${index}`} className="flex gap-3">
                  <div className="aspect-[3/4] w-12 shrink-0 overflow-hidden bg-[#F5F1E9]">
                    <img src={getItemImage(item)} alt={item.displayName} className="size-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-xs font-medium text-[#414141]">{item.displayName}</p>
                    <p className="mt-0.5 font-sans text-[10px] text-[#808080]">
                      {[item.displayColor, item.displaySize && `Size ${item.displaySize}`, `Qty ${item.qty}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-sans text-xs font-semibold text-[#414141]">{formatCurrency(item.lineTotal)}</span>
                      {hasDiscount && (
                        <span className="font-sans text-[10px] text-[#808080] line-through">{formatCurrency(item.lineOriginal)}</span>
                      )}
                    </div>
                    {item.displaySku && (
                      <p className="mt-0.5 text-[9px] uppercase tracking-wide text-[#a0a0a0]">SKU: {item.displaySku}</p>
                    )}
                  </div>
                </div>
              );
            })}
            {processedItems.length > 3 && (
              <p className="text-[10px] text-[#808080]">
                + {processedItems.length - 3} more item{processedItems.length - 3 === 1 ? "" : "s"}
              </p>
            )}
          </div>

          {/* Price summary */}
          {items.length > 0 && (
            <div className="mt-4 border-t border-border pt-3">
              <div className="flex justify-between font-sans text-[10px] text-[#6b6b6b]">
                <span>Subtotal</span>
                <span>{formatCurrency(computedSubtotal)}</span>
              </div>
              {computedDiscount > 0 && (
                <div className="mt-1 flex justify-between font-sans text-[10px] text-[#c0392b]">
                  <span>Discount</span>
                  <span>− {formatCurrency(computedDiscount)}</span>
                </div>
              )}
              <div className="mt-1 flex justify-between font-sans text-[10px] text-[#6b6b6b]">
                <span>Shipping</span>
                <span>{shipping > 0 ? formatCurrency(shipping) : "Free"}</span>
              </div>
              {tax > 0 && (
                <div className="mt-1 flex justify-between font-sans text-[10px] text-[#6b6b6b]">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              )}
              <div className="mt-2 flex justify-between border-t border-border pt-2 font-sans text-xs font-semibold text-[#414141]">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          {!isDead && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onTrack(order.id)}
                className="text-[10px] font-medium uppercase tracking-wide text-[#663f29] underline underline-offset-2 transition hover:text-[#414141]"
              >
                {selected ? "Refresh tracking" : "Track order"}
              </button>
              {canCancel && (
                <button
                  onClick={() => onCancel?.(order.id)}
                  className="text-[10px] font-medium uppercase tracking-wide text-[#c0392b] underline underline-offset-2 transition hover:text-[#8a2820]"
                >
                  Cancel order
                </button>
              )}
            </div>
          )}
        </div>

        {/* ✅ RIGHT: Terminal Status Block (Only for Delivered/Cancelled/Returned) */}
        {isTerminal && (
          <div className="md:border-l md:border-border md:pl-5 flex flex-col justify-start">
            <p className="mb-3 text-[10px] uppercase tracking-wide text-[#808080]">
              Order Status
            </p>
            <div className={`flex items-start gap-3 rounded-md border p-4 ${
              status === "delivered" ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
            }`}>
              {status === "delivered" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M5 12l5 5L20 7" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M18 6L6 18M6 6l12 12" /></svg>
              )}
              <div>
                <p className={`font-sans text-xs font-semibold capitalize ${status === "delivered" ? "text-emerald-700" : "text-red-700"}`}>
                  {statusLabel}
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-[#808080]">
                  {status === "delivered" 
                    ? "Your package was delivered successfully." 
                    : "This order has been closed and is no longer active."}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </article>
  );
}