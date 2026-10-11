import { useSelector } from "react-redux";
import { selectCheckoutAddress } from "../checkoutSlice";

export default function DeliverTo() {
  const addr = useSelector(selectCheckoutAddress);

  return (
    <div className="border border-border bg-white p-4 lg:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-sans text-sm text-[#414141]">
            <span className="font-medium">Deliver to :</span>{" "}
            <span className="text-[#414141]">{addr.name} {addr.line}</span>
          </p>
          <span className="mt-2 inline-block rounded-sm bg-[#E9E9E9] px-3 py-1 font-sans text-xs text-[#414141]">
            {addr.tag}
          </span>
        </div>
        <button className="shrink-0 border border-[#414141] px-4 py-2 font-sans text-xs font-medium uppercase tracking-wide text-[#414141] transition hover:bg-[#414141] hover:text-white">
          Change/Add Address
        </button>
      </div>
    </div>
  );
}