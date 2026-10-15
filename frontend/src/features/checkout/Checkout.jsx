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
    return <><SimpleHeader /><main className="bg-white"><div className="container-x py-24 text-center text-sm text-[#808080]">Loading your bag…</div></main></>;
  }

  if (order) {
    return (
      <><SimpleHeader /><main className="container-x py-20 text-center">
        <h1 className="text-2xl font-semibold text-[#414141]">Order placed</h1>
        <Link to={ROUTES.TRACK_ORDER} className="mt-6 inline-block bg-ink px-5 py-3 text-sm font-medium uppercase tracking-wide text-cream transition hover:bg-[#663f29]">Track your order</Link>
        <p className="mt-3 text-sm text-[#6b6b6b]">Order {order.order_number} is confirmed. Pay {formatCurrency(order.total_amount)} in cash on delivery.</p>
        <Link to={ROUTES.READY_TO_WEAR} className="mt-6 inline-block text-sm text-[#663f29] underline">Continue shopping</Link>
      </main></>
    );
  }

  if (!items.length) {
    return <><SimpleHeader /><main className="min-h-[60vh] bg-white"><div className="container-x py-24 text-center"><p className="font-sans text-lg text-[#6b6b6b]">Your bag is empty.</p><Link to={ROUTES.READY_TO_WEAR} className="mt-4 inline-block font-sans text-sm text-[#663f29] underline underline-offset-2">Continue shopping</Link></div></main></>;
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
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            {stage === 2 && <>
              <h1 className="mb-4 font-sans text-lg font-medium text-[#414141]">1. Select delivery address</h1>
              <DeliverTo />
            </>}
            {stage === 3 && <section className="border border-border bg-white p-5">
              <h1 className="font-sans text-lg font-medium text-[#414141]">2. Payment method</h1>
              {address && <p className="mt-3 text-sm text-[#6b6b6b]">Delivering to {address.full_name}, {address.address_line1}, {address.city}, {address.state} {address.postal_code}</p>}
              <label className="mt-5 flex cursor-pointer items-start gap-3 border border-[#663f29] bg-[#F5F1E9] p-4">
                <input type="radio" checked readOnly className="mt-1 accent-[#663f29]" />
                <span><span className="block text-sm font-medium text-[#414141]">Cash on Delivery</span><span className="mt-1 block text-xs text-[#808080]">Pay the order total in cash when your order is delivered.</span></span>
              </label>
            </section>}
            {stage === 4 && <section className="border border-border bg-white p-5">
              <h1 className="font-sans text-lg font-medium text-[#414141]">3. Confirm your bag</h1>
              <p className="mt-2 text-sm text-[#808080]">Review the items below, then confirm to place your COD order.</p>
              <div className="mt-5 space-y-4">{items.map((item, idx) => <BagItem key={`${item.id}-${item.size}-${idx}`} item={item} />)}</div>
              <label className="mt-5 flex items-start gap-3 text-sm text-[#414141]">
                <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1 accent-[#663f29]" />
                I confirm these cart items and quantities.
              </label>
            </section>}
            <h2 className="mt-7 font-sans text-base font-medium text-[#414141]">Shopping bag ({items.reduce((n, item) => n + Number(item.quantity || 0), 0)} items)</h2>
            {stage !== 4 && <div className="mt-4 space-y-4">{items.map((item, idx) => <BagItem key={`${item.id}-${item.size}-${idx}`} item={item} />)}</div>}
            {error && <p role="alert" className="mt-4 text-sm text-[#c0392b]">{error}</p>}
          </div>
          <div className="space-y-4 lg:sticky lg:top-[120px] lg:self-start">
            <OrderSummary confirmation={stage === 4} />
            <div className="flex gap-3">
              {stage > 2 && <button onClick={() => { setError(""); setStage(stage - 1); }} className="h-12 flex-1 border border-[#414141] font-sans text-sm font-medium uppercase tracking-wide text-[#414141]">Back</button>}
              {stage < 4 ? <button onClick={next} className="h-12 flex-1 bg-ink font-sans text-sm font-medium uppercase tracking-wide text-cream transition hover:bg-[#663f29]">Continue</button> : <button onClick={placeOrder} disabled={!confirmed || submitting} className="h-12 flex-1 bg-ink font-sans text-sm font-medium uppercase tracking-wide text-cream transition hover:bg-[#663f29] disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Placing order…" : "Place COD order"}</button>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
