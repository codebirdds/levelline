import api from "../../api/axiosInstance";
import { CONTACT } from "./endpoints";

const call = ({ method, url }, { data, params, args = [] } = {}) => {
  const resolved = typeof url === "function" ? url(...args) : url;
  return api({ method, url: resolved, data, params }).then((r) => r.data);
};

// Combine first/last into a single `name` for the backend
const toApiPayload = (form) => {
  const name = [form.first_name, form.last_name]
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .join(" ");

  return {
    name,
    email: form.email,
    phone: form.phone,
    project_description: form.project_description,
    // Optional fields — omit if you don't collect them
    service_needed: form.service_needed || undefined,
    budget_range: form.budget_range || undefined,
  };
};

export const createContact = async (form) =>
  call(CONTACT.CREATE, { data: toApiPayload(form) });

export const listContacts = async (params = {}) =>
  call(CONTACT.LIST, { params });

export const getContactById = async (id) =>
  call(CONTACT.DETAIL, { args: [id] });

export const updateContactStatus = async (id, status) =>
  call(CONTACT.STATUS, { data: { status }, args: [id] });