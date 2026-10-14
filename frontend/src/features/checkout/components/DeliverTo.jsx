import { useState } from "react";
import { useSelector } from "react-redux";
import { selectSelectedAddress } from "../../address/addressSlice";
import AddressListModal from "../../address/components/AddressListModal";

export default function DeliverTo() {
  const addr = useSelector(selectSelectedAddress);
  const [modalOpen, setModalOpen] = useState(false);

  if (!addr) {
    return (
      <div className="border border-border bg-white p-4 lg:p-5">
        <p className="font-sans text-sm text-[#808080]">No address selected.</p>
        <button
          onClick={() => setModalOpen(true)}
          className="mt-2 h-10 text-sm font-semibold bg-brand text-white px-4 rounded-md hover:bg-brand-dark transition"
        >
          Add Address
        </button>
        <AddressListModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="border border-border bg-white p-4 lg:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-sans text-sm text-[#414141]">
            <span className="font-medium">Deliver to : </span>
            <span className="text-[#414141]">
              {addr.full_name} · {addr.address_line1}, {addr.city}, {addr.state} - {addr.postal_code}
            </span>
          </p>
          <span className="mt-2 inline-block rounded-sm bg-[#E9E9E9] px-3 py-1 font-sans text-xs text-[#414141]">
            {addr.address_type}
          </span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 border border-[#414141] px-4 py-2 font-sans text-xs font-medium uppercase tracking-wide text-[#414141] transition hover:bg-[#414141] hover:text-white"
        >
          Change/Add Address
        </button>
      </div>
      <AddressListModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}