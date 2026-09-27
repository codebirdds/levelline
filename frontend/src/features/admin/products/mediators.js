import api from "../../../api/axiosInstance";
import { ADMIN_PRODUCTS } from "./endpoints";

const USE_MOCK = true;

// Seed storage — resets on full page reload (fine for dev)
let MOCK = [
  { id: 1, title: "Men Slim Fit Casual Shirt",  price: 899,  category: "men",    stock: 25, image: "https://picsum.photos/seed/p1/400/400" },
  { id: 2, title: "Women Floral Printed Kurta", price: 1299, category: "women",  stock: 12, image: "https://picsum.photos/seed/p2/400/400" },
  { id: 3, title: "Kids Cotton T-Shirt",        price: 499,  category: "kids",   stock: 40, image: "https://picsum.photos/seed/p3/400/400" },
  { id: 4, title: "Running Shoes - Black",      price: 2499, category: "men",    stock: 8,  image: "https://picsum.photos/seed/p4/400/400" },
  { id: 5, title: "Leather Handbag - Tan",      price: 1899, category: "women",  stock: 15, image: "https://picsum.photos/seed/p5/400/400" },
];

const call = ({ method, url }, { data, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  return api({ method, url: resolvedUrl, data }).then((r) => r.data);
};

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const listProducts = async () => {
  if (USE_MOCK) { await delay(); return [...MOCK]; }
  return call(ADMIN_PRODUCTS.LIST);
};

export const createProduct = async (payload) => {
  if (USE_MOCK) {
    await delay();
    const created = { ...payload, id: Date.now() };
    MOCK = [created, ...MOCK];
    return created;
  }
  return call(ADMIN_PRODUCTS.CREATE, { data: payload });
};

export const updateProduct = async (id, payload) => {
  if (USE_MOCK) {
    await delay();
    MOCK = MOCK.map((p) => (p.id === id ? { ...p, ...payload } : p));
    return MOCK.find((p) => p.id === id);
  }
  return call(ADMIN_PRODUCTS.UPDATE, { data: payload, args: [id] });
};

export const deleteProduct = async (id) => {
  if (USE_MOCK) {
    await delay();
    MOCK = MOCK.filter((p) => p.id !== id);
    return { ok: true };
  }
  return call(ADMIN_PRODUCTS.DELETE, { args: [id] });
};