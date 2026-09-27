import api from "../../../api/axiosInstance";
import { ADMIN_CATEGORIES } from "./endpoints";

const USE_MOCK = true;

let MOCK = [
  { id: 1, name: "Men",    slug: "men",    count: 42 },
  { id: 2, name: "Women",  slug: "women",  count: 58 },
  { id: 3, name: "Kids",   slug: "kids",   count: 21 },
  { id: 4, name: "Beauty", slug: "beauty", count: 14 },
];

const call = ({ method, url }, { data, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  return api({ method, url: resolvedUrl, data }).then((r) => r.data);
};

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const listCategories = async () => {
  if (USE_MOCK) { await delay(); return [...MOCK]; }
  return call(ADMIN_CATEGORIES.LIST);
};

export const createCategory = async (payload) => {
  if (USE_MOCK) {
    await delay();
    const created = { ...payload, id: Date.now(), count: 0 };
    MOCK = [created, ...MOCK];
    return created;
  }
  return call(ADMIN_CATEGORIES.CREATE, { data: payload });
};

export const updateCategory = async (id, payload) => {
  if (USE_MOCK) {
    await delay();
    MOCK = MOCK.map((c) => (c.id === id ? { ...c, ...payload } : c));
    return MOCK.find((c) => c.id === id);
  }
  return call(ADMIN_CATEGORIES.UPDATE, { data: payload, args: [id] });
};

export const deleteCategory = async (id) => {
  if (USE_MOCK) {
    await delay();
    MOCK = MOCK.filter((c) => c.id !== id);
    return { ok: true };
  }
  return call(ADMIN_CATEGORIES.DELETE, { args: [id] });
};