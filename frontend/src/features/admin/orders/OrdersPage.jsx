import { useCallback, useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { formatCurrency } from "../../../utils/formatCurrency";
import Button from "../../../components/common/Button";

// Only these can be picked from the dropdown
const SELECTABLE_STATUSES = ["pending", "confirmed", "processing", "shipped", "cancelled", "returned"];

// Once an order is in any of these, no further status changes are allowed
const TERMINAL_STATUSES = ["delivered", "cancelled", "returned"];

// ── Address modal ────────────────────────────────────────────
function AddressModal({ address, onClose }) {
  if (!address) return null;

  const rows = [
    ["Full name", address.full_name],
    ["Phone", address.phone],
    ["Address line 1", address.address_line1],
    ["Building", address.building_name],
    ["Floor", address.floor],
    ["Address line 2", address.address_line2],
    ["Landmark", address.landmark],
    ["City", address.city],
    ["State", address.state],
    ["Postal code", address.postal_code],
    ["Country", address.country],
    ["Address type", address.address_type],
    ["Delivery instructions", address.delivery_instructions],
  ].filter(([, v]) => v != null && String(v).trim() !== "");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-ink">Shipping Address</h2>
            {address.is_default && (
              <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700">
                Default
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-muted transition hover:bg-hover hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          <dl className="space-y-3">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[140px_1fr] gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
              >
                <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
                <dd className="text-sm text-ink break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-t border-border bg-[#fafafa] px-5 py-3 text-right">
          <Button onClick={onClose} className="!px-4 !py-2 !text-sm">Close</Button>
        </div>
      </div>
    </div>
  );
}

// ── Items modal ──────────────────────────────────────────────
function getItemImage(item) {
  const imgs = Array.isArray(item?.images) ? item.images : [];
  if (!imgs.length) return null;
  const primary = imgs.find((i) => i.is_primary) || imgs[0];
  return typeof primary === "string" ? primary : primary?.url;
}

function ItemRow({ item, index }) {
  const image = getItemImage(item);
  const unitPrice = Number(item.unit_price ?? 0);
  const discountedPrice = Number(item.discounted_unit_price ?? 0);
  const hasDiscount = discountedPrice > 0 && discountedPrice < unitPrice;
  const lineTotal = Number(
    item.subtotal ?? (hasDiscount ? discountedPrice : unitPrice) * (item.quantity ?? 1)
  );
  const discountPerUnit = hasDiscount ? unitPrice - discountedPrice : 0;
  const totalDiscount = discountPerUnit * (item.quantity ?? 1);

  return (
    <div className="border-b border-border/60 pb-5 last:border-0 last:pb-0">
      <div className="flex gap-4">
        <div className="aspect-[3/4] w-20 shrink-0 overflow-hidden bg-[#F5F1E9] sm:w-24">
          {image ? (
            <img
              src={image}
              alt={item.product_name}
              className="size-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="grid size-full place-items-center text-[10px] text-muted">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-semibold text-ink">
            {item.product_name || "Untitled product"}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {item.size && (
              <span className="rounded-full bg-[#F5F1E9] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink">
                Size: {item.size}
              </span>
            )}
            {item.color && (
              <span className="rounded-full bg-[#F5F1E9] px-2 py-0.5 text-[10px] font-medium text-ink">
                Color: {item.color}
              </span>
            )}
            {item.quantity && (
              <span className="rounded-full bg-[#F5F1E9] px-2 py-0.5 text-[10px] font-medium text-ink">
                Qty: {item.quantity}
              </span>
            )}
            {item.sku && (
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                SKU: {item.sku}
              </span>
            )}
          </div>

          <div className="mt-2 space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted">Unit price:</span>
              <span className={hasDiscount ? "text-muted line-through" : "text-ink font-medium"}>
                {formatCurrency(unitPrice)}
              </span>
              {hasDiscount && (
                <span className="font-medium text-emerald-700">
                  {formatCurrency(discountedPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted">Line total:</span>
              <span className="font-semibold text-ink">{formatCurrency(lineTotal)}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-muted">You saved:</span>
                <span className="font-medium text-emerald-700">
                  − {formatCurrency(totalDiscount)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <details className="mt-3 group">
        <summary className="cursor-pointer text-[11px] uppercase tracking-wide text-muted transition hover:text-ink">
          Product
        </summary>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-md bg-[#fafafa] p-3 text-[11px]">
          {Array.isArray(item.images) && item.images.length > 0 && (
            <>
              <dt className="col-span-2 mt-1 text-muted">Images ({item.images.length})</dt>
              <dd className="col-span-2">
                <div className="flex flex-wrap gap-2">
                  {item.images.map((img, idx) => {
                    const url = typeof img === "string" ? img : img?.url;
                    const isPrimary = typeof img === "object" && img?.is_primary;
                    return url ? (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`relative block size-12 overflow-hidden border ${
                          isPrimary ? "border-emerald-600" : "border-border"
                        }`}
                      >
                        <img
                          src={url}
                          alt=""
                          className="size-full object-cover"
                          loading="lazy"
                        />
                        {isPrimary && (
                          <span className="absolute inset-x-0 bottom-0 bg-emerald-600 text-center text-[8px] font-semibold uppercase text-white">
                            Primary
                          </span>
                        )}
                      </a>
                    ) : null;
                  })}
                </div>
              </dd>
            </>
          )}
        </dl>
      </details>
    </div>
  );
}

function ItemsModal({ order, onClose }) {
  if (!order) return null;

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = Number(order.subtotal ?? 0);
  const discount = Number(order.discount_amount ?? 0);
  const shipping = Number(order.shipping_fee ?? 0);
  const tax = Number(order.tax_amount ?? 0);
  const total = Number(order.total_amount ?? 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-ink">Order Items</h2>
            <p className="mt-0.5 text-xs text-muted">
              {order.order_number} · {items.length}{" "}
              {items.length === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-muted transition hover:bg-hover hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No items in this order.</p>
          ) : (
            <div className="space-y-5">
              {items.map((item, i) => (
                <ItemRow
                  key={`${item.product_variant_id ?? item.product_id}-${i}`}
                  item={item}
                  index={i}
                />
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-5 border-t border-border pt-4">
              <div className="flex justify-between text-xs text-muted">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="mt-1 flex justify-between text-xs text-emerald-700">
                  <span>Discount</span>
                  <span>− {formatCurrency(discount)}</span>
                </div>
              )}
              <div className="mt-1 flex justify-between text-xs text-muted">
                <span>Shipping</span>
                <span>{shipping > 0 ? formatCurrency(shipping) : "Free"}</span>
              </div>
              {tax > 0 && (
                <div className="mt-1 flex justify-between text-xs text-muted">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              )}
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-semibold text-ink">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border bg-[#fafafa] px-5 py-3 text-right">
          <Button onClick={onClose} className="!px-4 !py-2 !text-sm">Close</Button>
        </div>
      </div>
    </div>
  );
}

// ── Orders page ──────────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [search, setSearch] = useState("");
  const [viewAddress, setViewAddress] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("v1/order/admin/all", {
        params: { limit: 100, search: search || undefined },
      });
      setOrders(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const updateStatus = async (order, order_status) => {
    setSavingId(order.id);
    setError("");
    try {
      const response = await api.patch(
        `v1/order/admin/${order.id}/status`,
        { order_status }
      );
      const updated = response.data?.data;
      setOrders((current) =>
        current.map((item) =>
          item.id === order.id ? { ...item, ...updated } : item
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update order status.");
    } finally {
      setSavingId(null);
    }
  };

  const markDelivered = async (order) => {
    setSavingId(order.id);
    setError("");
    try {
      const response = await api.patch(`v1/order/admin/deliver/${order.id}`);
      const updated = response.data?.data;
      setOrders((current) =>
        current.map((item) =>
          item.id === order.id
            ? { ...item, ...(updated || {}), order_status: "delivered" }
            : item
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to mark as delivered.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search order number"
          className="w-full max-w-xs rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            <p className="text-sm text-muted">Loading orders…</p>
          </div>
        ) : !orders.length ? (
          <p className="p-8 text-center text-sm text-muted">No orders found.</p>
        ) : (
          <table className="w-full min-w-[1150px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Shipping Address</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total / payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isTerminal = TERMINAL_STATUSES.includes(order.order_status);
                const choices = isTerminal
                  ? []
                  : SELECTABLE_STATUSES.filter((s) => s !== order.order_status);

                const addr = order.address;
                const alreadyDelivered = order.order_status === "delivered";
                const itemsArr = Array.isArray(order.items) ? order.items : [];

                return (
                  <tr
                    key={order.id}
                    className="border-b border-border align-top last:border-0 hover:bg-hover"
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-ink">{order.order_number}</p>
                      <p className="mt-1 text-xs text-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-ink">
                        {order.user?.first_name && order.user?.last_name
                          ? `${order.user.first_name} ${order.user.last_name}`
                          : order.user?.name || addr?.full_name || "Customer"}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {order.user?.email || addr?.phone}
                      </p>
                    </td>

                    {/* Shipping Address */}
                    <td className="px-4 py-4">
                      {addr ? (
                        <>
                          <p className="font-medium text-ink">{addr.full_name}</p>
                          <p className="mt-0.5 text-xs text-muted">{addr.phone}</p>
                          <p className="mt-1 max-w-[220px] text-xs leading-snug text-muted">
                            {[
                              addr.address_line1,
                              addr.building_name,
                              addr.city,
                              addr.state,
                              addr.postal_code,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                          <button
                            onClick={() => setViewAddress(addr)}
                            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand underline underline-offset-2 transition hover:text-ink"
                          >
                            View
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M13 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <p className="text-xs text-muted">No address</p>
                      )}
                    </td>

                    {/* Items — summary + View button */}
                    <td className="px-4 py-4">
                      <p className="font-medium text-ink">
                        {itemsArr.length} {itemsArr.length === 1 ? "item" : "items"}
                      </p>
                      <div className="mt-1 space-y-1 text-xs text-muted">
                        {itemsArr.slice(0, 3).map((item, index) => (
                          <p key={`${item.product_variant_id ?? item.product_id}-${index}`}>
                            {item.product_name}
                            {item.size ? ` · ${item.size}` : ""}
                            {item.quantity ? ` × ${item.quantity}` : ""}
                          </p>
                        ))}
                        {itemsArr.length > 3 && (
                          <p>and {itemsArr.length - 3} more</p>
                        )}
                      </div>

                      {itemsArr.length > 0 && (
                        <button
                          onClick={() => setViewOrder(order)}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand underline underline-offset-2 transition hover:text-ink"
                        >
                          View all items
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M13 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium">
                        {formatCurrency(Number(order.total_amount))}
                      </p>
                      <p className="mt-1 text-xs uppercase text-muted">
                        {order.payment_method} · {order.payment_status}
                      </p>
                    </td>

                    <td className="px-4 py-4 capitalize">{order.order_status}</td>

                    {/* Update */}
                    <td className="px-4 py-4 align-top">
                      <div className="flex min-w-[140px] max-w-[180px] flex-col items-stretch gap-2">
                        {choices.length > 0 ? (
                          <select
                            aria-label={`Update ${order.order_number} status`}
                            disabled={savingId === order.id}
                            value=""
                            onChange={(event) =>
                              event.target.value &&
                              updateStatus(order, event.target.value)
                            }
                            className="w-full min-w-0 rounded-lg border border-border bg-white px-2.5 py-2 text-xs font-medium text-ink shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">
                              {savingId === order.id ? "Saving..." : "Change status"}
                            </option>
                            {choices.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-xs text-muted">Cannot update status</p>
                        )}

                        <Button
                          disabled={savingId === order.id || isTerminal}
                          onClick={() => markDelivered(order)}
                          className="!flex !w-full !items-center !justify-center !gap-1.5 !whitespace-nowrap !rounded-lg !bg-emerald-600 !px-2.5 !py-2 !text-xs !font-semibold !text-white !shadow-sm !transition-colors hover:!bg-emerald-700 disabled:!cursor-not-allowed disabled:!opacity-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="shrink-0"
                          >
                            <path d="m5 12 4 4L19 6" />
                          </svg>
                          {savingId === order.id
                            ? "Saving..."
                            : alreadyDelivered
                            ? "Delivered"
                            : "Mark Delivered"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {viewAddress && (
        <AddressModal
          address={viewAddress}
          onClose={() => setViewAddress(null)}
        />
      )}
      {viewOrder && (
        <ItemsModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
        />
      )}
    </div>
  );
}