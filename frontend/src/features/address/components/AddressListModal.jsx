import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../components/common/Modal";
import {
  selectAddresses, selectAddressLoading,
  selectSelectedAddressId,
  selectAddress, setDefaultAddressThunk, deleteAddressThunk,
  openForm, closeForm,
} from "../addressSlice";
import { fetchAddressesThunk } from "../addressThunks";
import AddressFormModal from "./AddressFormModal";


export default function AddressListModal({ open, onClose }) {
  const dispatch = useDispatch();
  const items = useSelector(selectAddresses);
  const loading = useSelector(selectAddressLoading);
  const selectedId = useSelector(selectSelectedAddressId);

  useEffect(() => {
    if (open) dispatch(fetchAddressesThunk());
  }, [open, dispatch]);

  const onAdd = () => dispatch(openForm(null));
  const onEdit = (a) => dispatch(openForm(a));
  const onSetDefault = (a) => dispatch(setDefaultAddressThunk(a.id));
  const onDelete = (a) => dispatch(deleteAddressThunk(a.id));

  return (
    <Modal open={open} onClose={onClose} title="Select Delivery Address" footer={null}>
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-6">
            <div className="h-6 w-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            <p className="text-xs text-muted">Loading addresses…</p>
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted text-center py-6">No addresses yet.</p>
        ) : (
          items.map((a) => (
            <div
              key={a.id}
              className={`relative border rounded-md p-4 cursor-pointer transition ${
                a.id === selectedId
                  ? "border-brand bg-brand-soft"
                  : "border-border hover:border-brand"
              }`}
              onClick={() => dispatch(selectAddress(a.id))}
            >
              {a.is_default && (
                <span className="absolute -top-2 right-3 text-[10px] font-semibold bg-brand text-white px-2 py-0.5 rounded-full">
                  Default
                </span>
              )}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{a.full_name}</p>
                  <p className="text-sm text-muted mt-1">
                    {a.address_line1}
                    {a.building_name ? `, ${a.building_name}` : ""}
                    {a.floor ? ` · ${a.floor}` : ""}
                  </p>
                  {a.address_line2 && <p className="text-sm text-muted">{a.address_line2}</p>}
                  <p className="text-sm text-muted">
                    {a.city}, {a.state} - {a.postal_code}
                  </p>
                  <p className="text-xs text-muted mt-1">Phone: {a.phone}</p>
                  {a.landmark && <p className="text-xs text-muted">Landmark: {a.landmark}</p>}
                  {a.delivery_instructions && (
                    <p className="text-xs text-muted italic mt-1">"{a.delivery_instructions}"</p>
                  )}
                  <span className="inline-block mt-2 text-[10px] uppercase tracking-wide text-muted">
                    {a.address_type}
                  </span>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); onSetDefault(a); }}
                    disabled={a.is_default}
                    className="text-xs font-semibold text-brand hover:underline disabled:opacity-40"
                  >
                    Set Default
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(a); }}
                    className="text-xs font-semibold text-brand hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(a); }}
                    className="text-xs font-semibold text-danger hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <button
          onClick={onAdd}
          className="w-full h-10 text-sm font-semibold bg-brand text-white rounded-md hover:bg-brand-dark transition"
        >
          + Add New Address
        </button>
      </div>
      <AddressFormModal />
    </Modal>
  );
}