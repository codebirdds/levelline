import { Link } from "react-router-dom";
import GarmentCanvas from "../components/GarmentCanvas.jsx";
import SectionHeading from "../../../components/common/SectionHeading";
import PillButton from "../../../components/common/PillButton";
import { TYPE } from "../../../components/common/typography";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useCart } from "../hooks/useStorage.js";
import { clearCart, removeFromCart, updateQuantity } from "../storage/cartStorage.js";

export default function CartPage() {
  const items = useCart();
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const qtyBtn = "flex size-8 items-center justify-center rounded-full border border-border text-[#6b6b6b] hover:border-ink";

  return (
    <main className="min-h-screen bg-page px-5 pb-20 pt-10 sm:px-10 lg:px-[10%]">
      <SectionHeading align="left" title="Your cart" />
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className={TYPE.p}>Your cart is empty.</p>
          <PillButton href="/customize" className="mt-6">Design a garment</PillButton>
        </div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {items.map((i) => (
              <li key={i.id} className="flex gap-4 py-5 sm:gap-6">
                <div className="w-24 shrink-0 rounded-sm bg-tile p-2 sm:w-32">
                  {/* the saved snapshot, drawn by the same shared renderer */}
                  <GarmentCanvas canvas={i.canvas} nodes={i.resolvedNodes} className="w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={TYPE.h3}>{i.productName}</h3>
                  <ul className={TYPE.p}>
                    {i.summary.map((s) => <li key={s.group}>{s.group}: <span className="text-[#6b6b6b]">{s.option}</span></li>)}
                  </ul>
                  <div className="mt-3 flex items-center gap-3">
                    <button className={qtyBtn} aria-label="Decrease" onClick={() => updateQuantity(i.id, i.quantity - 1)}></button>
                    <span className="font-sans text-sm text-[#6b6b6b]">{i.quantity}</span>
                    <button className={qtyBtn} aria-label="Increase" onClick={() => updateQuantity(i.id, i.quantity + 1)}>+</button>
                    <button className="ml-3 font-sans text-xs uppercase tracking-wide text-[#808080] underline hover:text-danger" onClick={() => removeFromCart(i.id)}>Remove</button>
                  </div>
                </div>
                <p className={`shrink-0 ${TYPE.bold}`}>{formatCurrency(i.price * i.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <button className="font-sans text-xs uppercase tracking-wide text-[#808080] underline hover:text-danger" onClick={clearCart}>Clear cart</button>
            <p className="flex items-center gap-4"><span className={TYPE.label}>Subtotal</span><span className={TYPE.bold}>{formatCurrency(total)}</span></p>
          </div>
          <p className={`mt-4 text-right ${TYPE.p}`}>Checkout isn't connected yet  this is a local demo cart.</p>
          <Link to="/customize" className="mt-2 inline-block font-sans text-xs uppercase tracking-wide text-[#808080] underline">Continue designing</Link>
        </>
      )}
    </main>
  );
}
