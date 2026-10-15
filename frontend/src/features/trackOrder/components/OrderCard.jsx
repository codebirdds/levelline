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

// Statuses that can still be cancelled by the customer
const CANCELLABLE = ["pending", "confirmed", "processing"];

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

  const subtotal = Number(order.subtotal ?? 0);
  const discount = Number(order.discount_amount ?? 0);
  const shipping = Number(order.shipping_fee ?? 0);
  const tax = Number(order.tax_amount ?? 0);
  const total = Number(order.total_amount ?? subtotal - discount + shipping + tax);

  const isDead = status === "cancelled" || status === "returned";
  const canCancel = CANCELLABLE.includes(status);

  return (
    <article className="border border-border bg-white">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-4 sm:p-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-[#808080]">
            Order number
          </p>
          <h2 className="mt-1 font-medium text-[#414141]">{order.order_number}</h2>
          <p className="mt-1 text-xs text-[#808080]">Placed {date}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusCls}`}
          >
            {statusLabel}
          </span>
          <div className="text-right">
            <p className="font-semibold text-[#414141]">{formatCurrency(total)}</p>
            <p className="mt-1 text-xs uppercase text-[#808080]">
              {PAYMENT_LABEL[order.payment_method] || order.payment_method || ""}
            </p>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_220px]">
        {/* LEFT: items + price summary */}
        <div>
          <p className="mb-3 text-xs uppercase tracking-wide text-[#808080]">
            Items
          </p>

          <div className="space-y-3">
            {items.slice(0, 3).map((item, index) => {
              const lineTotal = Number(
                item.subtotal ??
                  item.discounted_unit_price * item.quantity ??
                  item.unit_price * item.quantity ??
                  0
              );
              const hasDiscount =
                Number(item.discount_amount || 0) > 0 &&
                Number(item.unit_price) > Number(item.discounted_unit_price);

              return (
                <div
                  key={`${item.product_variant_id ?? item.product_id}-${item.size}-${index}`}
                  className="flex gap-3"
                >
                  <div className="aspect-[3/4] w-14 shrink-0 overflow-hidden bg-[#F5F1E9]">
                    <img
                      src={getItemImage(item)}
                      alt={item.product_name}
                      className="size-full object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#414141]">
                      {item.product_name}
                    </p>
                    <p className="mt-0.5 text-xs text-[#808080]">
                      {[
                        item.size && `Size ${item.size}`,
                        item.color,
                        `Qty ${item.quantity}`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>

                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-[#414141]">
                        {formatCurrency(lineTotal)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-[#808080] line-through">
                          {formatCurrency(Number(item.unit_price) * item.quantity)}
                        </span>
                      )}
                    </div>

                    {item.sku && (
                      <p className="mt-0.5 text-[10px] uppercase tracking-wide text-[#a0a0a0]">
                        SKU: {item.sku}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {items.length > 3 && (
              <p className="text-xs text-[#808080]">
                + {items.length - 3} more item{items.length - 3 === 1 ? "" : "s"}
              </p>
            )}
          </div>

          {/* Price summary */}
          {items.length > 0 && (
            <div className="mt-4 border-t border-border pt-3">
              <div className="flex justify-between text-xs text-[#6b6b6b]">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="mt-1 flex justify-between text-xs text-[#c0392b]">
                  <span>Discount</span>
                  <span>− {formatCurrency(discount)}</span>
                </div>
              )}

              {shipping > 0 ? (
                <div className="mt-1 flex justify-between text-xs text-[#6b6b6b]">
                  <span>Shipping</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
              ) : (
                <div className="mt-1 flex justify-between text-xs text-[#6b6b6b]">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              )}

              {tax > 0 && (
                <div className="mt-1 flex justify-between text-xs text-[#6b6b6b]">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              )}

              <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-semibold text-[#414141]">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          {/* ── Actions ── */}
          {!isDead && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onTrack(order.id)}
                className="text-xs font-medium uppercase tracking-wide text-[#663f29] underline underline-offset-2 transition hover:text-[#414141]"
              >
                {selected ? "Refresh tracking" : "Track order"}
              </button>

              {canCancel && (
                <button
                  onClick={() => onCancel?.(order.id)}
                  className="text-xs font-medium uppercase tracking-wide text-[#c0392b] underline underline-offset-2 transition hover:text-[#8a2820]"
                >
                  Cancel order
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: timeline */}
        <div className="md:border-l md:border-border md:pl-5">
          <p className="mb-3 text-xs uppercase tracking-wide text-[#808080]">
            {isDead ? "Order status" : "Delivery progress"}
          </p>
          <OrderTimeline status={status} />
        </div>
      </div>
    </article>
  );
}