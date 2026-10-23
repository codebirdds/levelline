import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { selectCartItems, selectCartLoading, selectCartFetched, fetchCartThunk, clearCart } from "../cart/cartSlice";
import { fetchAddressesThunk } from "../address/addressThunks";
import { selectSelectedAddress } from "../address/addressSlice";
import api from "../../api/axiosInstance";
import CheckoutStepper from "./components/CheckoutStepper";
import DeliverTo from "./components/DeliverTo";
import BagItem from "./components/BagItem";
import OrderSummary from "./components/OrderSummary";
import SimpleHeader from "../../components/layout/SimpleHeader";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Checkout() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems) || [];
  const loading = useSelector(selectCartLoading);
  const fetched = useSelector(selectCartFetched);
  const address = useSelector(selectSelectedAddress);
  const [stage, setStage] = useState(2);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!fetched) dispatch(fetchCartThunk());
    dispatch(fetchAddressesThunk());
  }, [dispatch, fetched]);

  useEffect(() => {
    setConfirmed(false);
  }, [items]);

  const placeOrder = async () => {
    if (!address?.id || !confirmed || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await api.post("v1/order", { address_id: address.id, payment_method: "cod" });
      const created = response.data?.data;
      setOrder(created);
      dispatch(clearCart());
    } catch (err) {
      setError(err.response?.data?.message || "Could not place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !fetched) {
    return (
      <>
        <SimpleHeader />
        <main className="bg-white">
          <div className="container-x py-24 flex flex-col items-center gap-4 text-center">
            <div className="h-6 w-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            <p className="text-xs text-[#808080]">Loading your bag…</p>
          </div>
        </main>
      </>
    );
  }

  if (order) {
    return (
      <>
        <SimpleHeader />
        <main className="container-x py-20 text-center">
          <h1 className="text-xl font-semibold text-[#414141]">Order placed</h1>
          <Link to={ROUTES.TRACK_ORDER} className="mt-5 inline-block bg-ink px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-cream transition hover:bg-[#663f29]">Track your order</Link>
          <p className="mt-3 text-xs text-[#6b6b6b]">Order {order.order_number} is confirmed. Pay {formatCurrency(order.total_amount)} in cash on delivery.</p>
          <Link to={ROUTES.READY_TO_WEAR} className="mt-5 inline-block text-xs text-[#663f29] underline">Continue shopping</Link>
        </main>
      </>
    );
  }

  if (!items.length) {
    return (
      <>
        <SimpleHeader />
        <main className="min-h-[60vh] bg-white">
          <div className="container-x py-24 text-center">
            <p className="font-sans text-base text-[#6b6b6b]">Your bag is empty.</p>
            <Link to={ROUTES.READY_TO_WEAR} className="mt-3 inline-block font-sans text-xs text-[#663f29] underline underline-offset-2">Continue shopping</Link>
          </div>
        </main>
      </>
    );
  }

  const next = () => {
    setError("");
    if (stage === 2 && !address?.id) return setError("Select a delivery address to continue.");
    if (stage < 4) setStage(stage + 1);
  };

  return (
    <main className="min-h-screen bg-white">
      <SimpleHeader />
      <CheckoutStepper current={stage} />
      <div className="container-x pb-16">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
          
          {/* LEFT PANEL */}
          <div>
            {stage === 2 && (
              <>
                <h1 className="mb-3 font-sans text-sm font-medium uppercase tracking-wide text-[#414141]">1. Select delivery address</h1>
                <DeliverTo />
              </>
            )}
            
            {stage === 3 && (
              <section className="border border-border bg-white p-4">
                <h1 className="font-sans text-sm font-medium uppercase tracking-wide text-[#414141]">2. Payment method</h1>
                {address && <p className="mt-2 text-xs text-[#6b6b6b]">Delivering to {address.full_name}, {address.address_line1}, {address.city}, {address.state} {address.postal_code}</p>}
                <label className="mt-4 flex cursor-pointer items-start gap-3 border border-[#663f29] bg-[#F5F1E9] p-3">
                  <input type="radio" checked readOnly className="mt-0.5 accent-[#663f29]" />
                  <span>
                    <span className="block text-xs font-medium text-[#414141]">Cash on Delivery</span>
                    <span className="mt-0.5 block text-[10px] text-[#808080]">Pay the order total in cash when your order is delivered.</span>
                  </span>
                </label>
              </section>
            )}
            
            {stage === 4 && (
              <section className="border border-border bg-white p-4">
                <h1 className="font-sans text-sm font-medium uppercase tracking-wide text-[#414141]">3. Confirm your bag</h1>
                <p className="mt-1 text-xs text-[#808080]">Review the items below, then confirm to place your COD order.</p>
                {/* ✅ Changed to 2 columns to use space */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map((item, idx) => (
                    <BagItem key={`${item.id}-${item.size}-${idx}`} item={item} />
                  ))}
                </div>
              </section>
            )}

            <h2 className="mt-5 font-sans text-xs font-medium uppercase tracking-wide text-[#414141]">
              Shopping bag ({items.reduce((n, item) => n + Number(item.quantity || 0), 0)} items)
            </h2>
            
            {stage !== 4 && (
              /* ✅ Changed to 2 columns to use space */
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item, idx) => (
                  <BagItem key={`${item.id}-${item.size}-${idx}`} item={item} />
                ))}
              </div>
            )}
            
            {error && <p role="alert" className="mt-3 text-xs text-[#c0392b]">{error}</p>}
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-3 lg:sticky lg:top-[120px] lg:self-start">
            
            <OrderSummary 
              confirmation={stage === 4} 
              confirmed={confirmed}
              setConfirmed={setConfirmed}
            />
            
            <div className="flex gap-2">
              {stage > 2 && (
                <button 
                  onClick={() => { setError(""); setStage(stage - 1); }} 
                  className="h-10 flex-1 border border-[#414141] font-sans text-xs font-medium uppercase tracking-wide text-[#414141]"
                >
                  Back
                </button>
              )}
              
              {stage < 4 ? (
                <button 
                  onClick={next} 
                  className="h-10 flex-1 bg-ink font-sans text-xs font-medium uppercase tracking-wide text-cream transition hover:bg-[#663f29]"
                >
                  Continue
                </button>
              ) : (
                <button 
                  onClick={placeOrder} 
                  disabled={!confirmed || submitting} 
                  className="h-10 flex-1 bg-ink font-sans text-xs font-medium uppercase tracking-wide text-cream transition hover:bg-[#663f29] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>{submitting ? "Placing order…" : "Place COD order"}</span>
                  {submitting && <span className="h-3 w-3 rounded-full border-2 border-cream/70 border-t-transparent animate-spin" />}
                </button>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}