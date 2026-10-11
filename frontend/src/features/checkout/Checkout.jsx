import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { selectCheckoutItems } from "./checkoutSlice";
import CheckoutStepper from "./components/CheckoutStepper";
import DeliverTo from "./components/DeliverTo";
import BagItem from "./components/BagItem";
import OrderSummary from "./components/OrderSummary";
import MoreCoupons from "./components/MoreCoupons";
import SimpleHeader from "../../components/layout/SimpleHeader";

export default function Checkout() {
  const items = useSelector(selectCheckoutItems);

  if (!items.length) {
    return (
      <main className="mt-[100px] min-h-[60vh] bg-white">
        <div className="container-x py-24 text-center">
          <p className="font-sans text-lg text-[#6b6b6b]">Your bag is empty.</p>
          <Link
            to={ROUTES.READY_TO_WEAR}
            className="mt-4 inline-block font-sans text-sm text-[#663f29] underline underline-offset-2"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
        <SimpleHeader />
      <CheckoutStepper current={1} />

      <div className="container-x pb-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          {/* ─── LEFT ─── */}
          <div>
            <DeliverTo />

            <h2 className="mt-6 font-sans text-base font-medium text-[#414141] lg:mt-8 lg:text-lg">
              Shopping Bag ({items.length} {items.length === 1 ? "item" : "items"})
            </h2>

            <div className="mt-4 space-y-4">
              {items.map((i) => (
                <BagItem key={`${i.id}-${i.size}`} item={i} />
              ))}
            </div>
          </div>

          {/* ─── RIGHT ─── */}
          <div className="space-y-4 lg:sticky lg:top-[120px] lg:self-start">
            <OrderSummary />
            <MoreCoupons />
            <button className="h-12 w-full bg-ink font-sans text-sm font-medium uppercase tracking-wide text-cream transition hover:bg-[#663f29]">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}