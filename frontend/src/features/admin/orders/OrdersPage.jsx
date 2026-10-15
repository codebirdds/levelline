import { useCallback, useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import Spinner from "../../../components/common/Spinner";
import { formatCurrency } from "../../../utils/formatCurrency";
import Button from "../../../components/common/Button";

const STATUSES = ["pending", "confirmed", "processing","shipped","delivered","cancelled", "returned"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [search, setSearch] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("v1/order/admin/all", { params: { limit: 100, search: search || undefined } });
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
      const response = await api.patch(`v1/order/admin/${order.id}/status`, { order_status });
      const updated = response.data?.data;
      setOrders((current) => current.map((item) => item.id === order.id ? { ...item, ...updated } : item));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update order status.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{orders.length} {orders.length === 1 ? "order" : "orders"}</p>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order number" className="w-full max-w-xs rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand" />
      </div>
      {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        {loading ? <Spinner full /> : !orders.length ? <p className="p-8 text-center text-sm text-muted">No orders found.</p> : (
          <table className="w-full min-w-[900px] text-sm">
            <thead><tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer / delivery</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Total / payment</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Update</th>
            </tr></thead>
            <tbody>{orders.map((order) => {
              const choices = STATUSES.filter((status) => status !== order.order_status && !(status === "cancelled" && order.payment_status === "paid"));
              return <tr key={order.id} className="border-b border-border last:border-0 align-top hover:bg-hover">
                <td className="px-4 py-4"><p className="font-medium text-ink">{order.order_number}</p><p className="mt-1 text-xs text-muted">{new Date(order.createdAt).toLocaleDateString()}</p></td>
                <td className="px-4 py-4"><p className="font-medium text-ink">{order.user?.name || order.address?.full_name || "Customer"}</p><p className="mt-1 max-w-[220px] text-xs text-muted">{[order.address?.address_line1, order.address?.city, order.address?.state, order.address?.postal_code].filter(Boolean).join(", ")}</p><p className="text-xs text-muted">{order.address?.phone}</p></td>
                <td className="px-4 py-4"><p>{Array.isArray(order.items) ? order.items.length : 0} line items</p><div className="mt-1 space-y-1 text-xs text-muted">{(Array.isArray(order.items) ? order.items : []).slice(0, 3).map((item, index) => <p key={`${item.product_id}-${index}`}>{item.product_name} · {item.size} × {item.quantity}</p>)}{order.items?.length > 3 && <p>and {order.items.length - 3} more</p>}</div></td>
                <td className="px-4 py-4"><p className="font-medium">{formatCurrency(Number(order.total_amount))}</p><p className="mt-1 text-xs uppercase text-muted">{order.payment_method} · {order.payment_status}</p></td>
                <td className="px-4 py-4 capitalize">{order.order_status}</td>
    
<td className="px-4 py-4 align-top">
  <div className="flex min-w-[140px] max-w-[180px] flex-col items-stretch gap-2">
    {choices.length > 0 ? (
      <select
        aria-label={`Update ${order.order_number} status`}
        disabled={savingId === order.id}
        value=""
        onChange={(event) =>
          event.target.value && updateStatus(order, event.target.value)
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
      <p className="text-xs text-muted">No other statuses</p>
    )}

    <Button
      disabled={savingId === order.id || order.order_status === "delivered"}
      onClick={() => updateStatus(order, "delivered")}
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
      {savingId === order.id ? "Saving..." : "Mark Delivered"}
    </Button>
  </div>
</td>

              </tr>;
            })}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
