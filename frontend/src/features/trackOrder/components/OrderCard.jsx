import { formatCurrency } from "../../../utils/formatCurrency";
import OrderTimeline from "./OrderTimeline";

const STATUS_LABEL = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-amber-50 text-amber-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  returned: "bg-red-50 text-red-700",
};

const PAYMENT_LABEL = {
  cod: "Cash on Delivery",
  razorpay: "Razorpay (Online)",
  online: "Online",
  upi: "UPI",
  card: "Card",
};

const PAYMENT_STATUS_STYLE = {
  paid: "text-emerald-600",
  pending: "text-amber-600",
  failed: "text-red-600",
  refunded: "text-gray-600",
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

const CANCELLABLE = ["pending", "confirmed", "processing"];
const TERMINAL = ["delivered", "cancelled", "returned"];

// ✅ Added onPay prop
export default function OrderCard({ order, selected, onTrack, onCancel, onPay }) {
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const items = Array.isArray(order.items) ? order.items : [];
  const actualStatus = order.order_status || "pending";
  
  let displayLabel = STATUS_LABEL[actualStatus] || actualStatus;
  let displayStyle = STATUS_STYLE[actualStatus] || "bg-gray-100 text-gray-700";

  const isRazorpayPending = order.payment_method === "razorpay" && order.payment_status === "pending";

  if (isRazorpayPending) {
    displayLabel = "Payment Pending";
    displayStyle = "bg-red-50 text-red-700"; // Make it red so user notices
  } else if (actualStatus === "pending") {
    displayLabel = "Placed";
    displayStyle = "bg-[#F5F1E9] text-[#663f29]";
  }

  const isDead = actualStatus === "cancelled" || actualStatus === "returned";
  const isTerminal = TERMINAL.includes(actualStatus);
  const canCancel = CANCELLABLE.includes(actualStatus);

  const processedItems = items.map((item) => {
    return {
      ...item,
      displayName: item.product_name || item.variant?.name || item.product?.name || "Product",
      displayColor: item.color || item.variant?.color,
      displaySize: item.size,
      displaySku: item.sku,
      qty: Number(item.quantity) || 1,
    };
  });

  const totalAmount = Number(order.total_amount) || 0;

  return (
    <article className="border border-border bg-white">
      <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#808080]">Order number</p>
          <h2 className="mt-1 font-sans text-sm font-medium text-[#414141]">{order.order_number}</h2>
          <p className="mt-1 text-[11px] text-[#808080]">Placed {date}</p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span className={`inline-block rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ${displayStyle}`}>
            {displayLabel}
          </span>
          
          <div className="text-left sm:text-right mt-1">
            <p className="font-sans text-sm font-semibold text-[#414141]">{formatCurrency(totalAmount)}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1 sm:justify-end text-[10px] uppercase">
              <span className="text-[#808080]">{PAYMENT_LABEL[order.payment_method] || order.payment_method}</span>
              <span className="text-gray-300">•</span>
              <span className={`font-bold ${PAYMENT_STATUS_STYLE[order.payment_status] || "text-gray-500"}`}>
                {order.payment_status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {!isTerminal && !isRazorpayPending && (
        <div className="border-b border-border bg-[#fafafa] px-4 py-5 sm:px-6">
          <OrderTimeline status={actualStatus} />
        </div>
      )}

      <div className={isTerminal ? "grid gap-5 p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_260px]" : "p-4 sm:p-5"}>
        <div>
          <p className="mb-3 text-[10px] uppercase tracking-wide text-[#808080]">Items</p>
          <div className="space-y-3">
            {processedItems.slice(0, 3).map((item, index) => {
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

          {/* Actions */}
          {!isDead && (
            <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border pt-4">
              <button
                onClick={() => onTrack(order.id)}
                className="text-[10px] font-medium uppercase tracking-wide text-[#663f29] underline underline-offset-2 transition hover:text-[#414141]"
              >
                {selected ? "Refresh tracking" : "Track order"}
              </button>
              
              {/* ✅ Complete Payment Button */}
              {isRazorpayPending && (
                <button
                  onClick={() => onPay?.(order)}
                  className="bg-[#663f29] text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wide transition hover:bg-[#4a2d1d]"
                >
                  Complete Payment
                </button>
              )}

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

        {isTerminal && (
          <div className="md:border-l md:border-border md:pl-5 flex flex-col justify-start">
            <p className="mb-3 text-[10px] uppercase tracking-wide text-[#808080]">Order Status</p>
            <div className={`flex items-start gap-3 rounded-md border p-4 ${
              actualStatus === "delivered" ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
            }`}>
              {actualStatus === "delivered" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M5 12l5 5L20 7" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M18 6L6 18M6 6l12 12" /></svg>
              )}
              <div>
                <p className={`font-sans text-xs font-semibold capitalize ${actualStatus === "delivered" ? "text-emerald-700" : "text-red-700"}`}>
                  {STATUS_LABEL[actualStatus] || actualStatus}
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-[#808080]">
                  {actualStatus === "delivered" 
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