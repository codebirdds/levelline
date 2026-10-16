import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import SimpleHeader from "../../components/layout/SimpleHeader";
import OrderCard from "./components/OrderCard";
import {
  clearSelectedOrder,
  selectMyOrders,
  selectMyOrdersError,
  selectMyOrdersLoading,
  selectTrackedOrder,
  selectTrackedOrderLoading,
  selectTrackedOrderError,
} from "./trackOrderSlice";
import {
  fetchMyOrderThunk,
  fetchMyOrdersThunk,
  cancelMyOrderThunk,
} from "./trackOrderThunks";

export default function TrackOrder() {
  const dispatch = useDispatch();
  const orders = useSelector(selectMyOrders);
  const loading = useSelector(selectMyOrdersLoading);
  const error = useSelector(selectMyOrdersError);
  const selectedOrder = useSelector(selectTrackedOrder);
  const detailLoading = useSelector(selectTrackedOrderLoading);
  const detailError = useSelector(selectTrackedOrderError);

  useEffect(() => {
    dispatch(fetchMyOrdersThunk());
    return () => dispatch(clearSelectedOrder());
  }, [dispatch]);

  const trackOrder = (id) => dispatch(fetchMyOrderThunk(id));

  // ── Cancel order — passes order_id to the thunk
  const cancelOrder = async (orderId) => {
    if (!orderId) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await dispatch(cancelMyOrderThunk(orderId));
      toast.success("Order cancelled");

      // Refresh the list + any currently open tracking panel
      dispatch(fetchMyOrdersThunk());
      if (selectedOrder?.id === orderId) {
        dispatch(fetchMyOrderThunk(orderId));
      }
    } catch (err) {
      toast.error(err?.message || "Failed to cancel order");
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <SimpleHeader />
      <div className="container-x pb-16 pt-8 lg:pt-12">
        <div className="mb-7">
          <p className="text-xs uppercase tracking-[0.18em] text-[#808080]">
            Your account
          </p>
          <h1 className="mt-2 font-serif text-3xl text-[#252525]">
            Track your orders
          </h1>
          <p className="mt-2 text-sm text-[#6b6b6b]">
            View the latest status and delivery progress for your orders.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}
        {detailError && (
          <div
            role="alert"
            className="mb-5 border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {detailError}
          </div>
        )}

        {detailLoading && (
          <div className="mb-5 border border-border bg-white p-5">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
              <p className="text-sm text-[#808080]">Loading order details…</p>
            </div>
          </div>
        )}

        {selectedOrder && !detailLoading && (
          <section
            className="mb-6 border border-[#663f29]/30 bg-[#F5F1E9] p-4 sm:p-5"
            aria-live="polite"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#808080]">
                  Tracking details
                </p>
                <h2 className="mt-1 font-medium text-[#414141]">
                  {selectedOrder.order_number}
                </h2>
                <p className="mt-2 text-sm capitalize text-[#414141]">
                  Current status: <strong>{selectedOrder.order_status}</strong>
                </p>
              </div>
              <button
                onClick={() => dispatch(clearSelectedOrder())}
                className="text-xs font-medium text-[#663f29] underline underline-offset-2"
              >
                Close
              </button>
            </div>

            {selectedOrder.address && (
              <p className="mt-3 text-sm text-[#6b6b6b]">
                Delivery address: {selectedOrder.address.full_name},{" "}
                {selectedOrder.address.address_line1},{" "}
                {selectedOrder.address.city}, {selectedOrder.address.state}{" "}
                {selectedOrder.address.postal_code}
              </p>
            )}

            <div className="mt-4">
              <OrderCard
                order={selectedOrder}
                selected
                onTrack={trackOrder}
                onCancel={cancelOrder}
              />
            </div>
          </section>
        )}

        {loading ? (
          <div className="border border-border bg-white p-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
              <p className="text-sm text-[#808080]">Loading your orders…</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="border border-border bg-white px-5 py-14 text-center">
            <h2 className="text-lg font-medium text-[#414141]">No orders yet</h2>
            <p className="mt-2 text-sm text-[#808080]">
              Your orders will appear here after checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                selected={selectedOrder?.id === order.id}
                onTrack={trackOrder}
                onCancel={cancelOrder}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}