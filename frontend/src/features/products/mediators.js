import api from "../../api/axiosInstance";
import { PRODUCTS } from "./endpoints";

const USE_MOCK = true;

const DUMMY_PRODUCTS = [
  { id: 1,  title: "Men Slim Fit Casual Shirt",       price: 899,  image: "https://picsum.photos/seed/p1/400/400", category: "men"   },
  { id: 2,  title: "Women Floral Printed Kurta",      price: 1299, image: "https://picsum.photos/seed/p2/400/400", category: "women" },
  { id: 3,  title: "Kids Cotton Round Neck T-Shirt",  price: 499,  image: "https://picsum.photos/seed/p3/400/400", category: "kids"  },
  { id: 4,  title: "Running Shoes - Black",           price: 2499, image: "https://picsum.photos/seed/p4/400/400", category: "men"   },
  { id: 5,  title: "Leather Handbag - Tan",           price: 1899, image: "https://picsum.photos/seed/p5/400/400", category: "women" },
  { id: 6,  title: "Analog Wrist Watch - Silver",     price: 3499, image: "https://picsum.photos/seed/p6/400/400", category: "men"   },
  { id: 7,  title: "Matte Lipstick - Crimson",        price: 599,  image: "https://picsum.photos/seed/p7/400/400", category: "beauty"},
  { id: 8,  title: "Wireless Bluetooth Earphones",    price: 1599, image: "https://picsum.photos/seed/p8/400/400", category: "genz"  },
  { id: 9,  title: "Denim Jacket - Blue",             price: 2199, image: "https://picsum.photos/seed/p9/400/400", category: "men"   },
  { id: 10, title: "Cotton Anarkali Suit Set",        price: 2799, image: "https://picsum.photos/seed/p10/400/400", category: "women"},
  { id: 11, title: "Sports Cap - Navy",               price: 399,  image: "https://picsum.photos/seed/p11/400/400", category: "men"   },
  { id: 12, title: "Perfume - Ocean Breeze",          price: 1899, image: "https://picsum.photos/seed/p12/400/400", category: "beauty"},
  { id: 13, title: "Sunglasses - Aviator",            price: 999,  image: "https://picsum.photos/seed/p13/400/400", category: "men"   },
  { id: 14, title: "Kids Denim Dungaree",             price: 1199, image: "https://picsum.photos/seed/p14/400/400", category: "kids"  },
  { id: 15, title: "Sports Water Bottle 1L",          price: 349,  image: "https://picsum.photos/seed/p15/400/400", category: "home"  },
  { id: 16, title: "Women's Sports Leggings",         price: 799,  image: "https://picsum.photos/seed/p16/400/400", category: "women" },
  { id: 17, title: "Formal Blazer - Charcoal",        price: 3499, image: "https://picsum.photos/seed/p17/400/400", category: "men"   },
  { id: 18, title: "Hair Dryer 1800W",                price: 1299, image: "https://picsum.photos/seed/p18/400/400", category: "beauty"},
  { id: 19, title: "Canvas Backpack - Grey",          price: 1399, image: "https://picsum.photos/seed/p19/400/400", category: "genz"  },
  { id: 20, title: "Silk Scarf - Multicolor",         price: 649,  image: "https://picsum.photos/seed/p20/400/400", category: "women" },
  { id: 21, title: "Gaming Mouse RGB",                price: 1899, image: "https://picsum.photos/seed/p21/400/400", category: "genz"  },
  { id: 22, title: "Cotton Bedsheet Set",             price: 1099, image: "https://picsum.photos/seed/p22/400/400", category: "home"  },
  { id: 23, title: "Men Chinos - Beige",              price: 1499, image: "https://picsum.photos/seed/p23/400/400", category: "men"   },
  { id: 24, title: "Face Serum - Vitamin C",          price: 899,  image: "https://picsum.photos/seed/p24/400/400", category: "beauty"},
];

const call = ({ method, url }, { data, params, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  return api({ method, url: resolvedUrl, data, params }).then((r) => r.data);
};

export const getProducts = async (params) => {
  if (USE_MOCK) return DUMMY_PRODUCTS;
  return call(PRODUCTS.LIST, { params });
};

export const searchProducts = async (q) => {
  if (USE_MOCK) {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return DUMMY_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }
  return call(PRODUCTS.SEARCH, { params: { q } });
};

export const getProductById = async (id) => {
  if (USE_MOCK) return DUMMY_PRODUCTS.find((p) => p.id === Number(id));
  return call(PRODUCTS.DETAIL, { args: [id] });
};