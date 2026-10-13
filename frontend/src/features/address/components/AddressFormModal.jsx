import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../components/common/Modal";
import {
  selectAddressFormOpen, selectAddressEditing, selectSubmitting,
  selectAddresses,
  closeForm,
} from "../addressSlice";
import { createAddressThunk, updateAddressThunk } from "../addressThunks";

const EMPTY = {
  full_name: "",
  phone: "",
  address_line1: "",
  building_name: "",
  floor: "",
  address_line2: "",
  landmark: "",
  delivery_instructions: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
  address_type: "home",
  is_default: false,
};

export default function AddressFormModal() {
  const dispatch = useDispatch();
  const open = useSelector(selectAddressFormOpen);
  const editing = useSelector(selectAddressEditing);
  const submitting = useSelector(selectSubmitting);
  const items = useSelector(selectAddresses);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(editing ? { ...EMPTY, ...editing } : EMPTY);
  }, [editing, open]);

  const onClose = () => !submitting && dispatch(closeForm());

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      is_default: form.is_default || items.length === 0,
    };
    if (editing) dispatch(updateAddressThunk({ id: editing.id, payload }));
    else dispatch(createAddressThunk(payload));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit Address" : "Add Address"}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-hover">Cancel</button>
          <button
            form="address-form"
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? "Saving…" : editing ? "Save Changes" : "Create"}
          </button>
        </>
      }
    >
      <form id="address-form" onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name *">
            <input required value={form.full_name} onChange={(e) => set("full_name", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Phone *">
            <input required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
        </div>

        <Field label="Address Line 1 *">
          <input required value={form.address_line1} onChange={(e) => set("address_line1", e.target.value)}
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Building Name">
            <input value={form.building_name} onChange={(e) => set("building_name", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Floor">
            <input value={form.floor} onChange={(e) => set("floor", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
        </div>

        <Field label="Address Line 2">
          <input value={form.address_line2} onChange={(e) => set("address_line2", e.target.value)}
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Landmark">
            <input value={form.landmark} onChange={(e) => set("landmark", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Delivery Instructions">
            <input value={form.delivery_instructions} onChange={(e) => set("delivery_instructions", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="City *">
            <input required value={form.city} onChange={(e) => set("city", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="State *">
            <input required value={form.state} onChange={(e) => set("state", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Postal Code *">
            <input required value={form.postal_code} onChange={(e) => set("postal_code", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Country *">
            <input required value={form.country} onChange={(e) => set("country", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Address Type">
            <select value={form.address_type} onChange={(e) => set("address_type", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none bg-surface">
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_default} onChange={(e) => set("is_default", e.target.checked)} />
          Set as default address
        </label>
      </form>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block mb-1 text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}