# Leveline / Shopcart — Frontend Project Context

> Full handoff document. Paste into any AI to bootstrap understanding of this codebase.

---

## 1. Project Overview

- **Name:** Leveline (branding: "Shopcart")
- **Type:** Myntra/Flipkart-style e-commerce SPA
- **Stack:** React 19 + Vite + Redux Toolkit + React Router v7 + Tailwind CSS v3 + Axios
- **Backend:** Not yet wired (all API calls go through feature-level mediators with `USE_MOCK = true`)
- **Dev mode:** All data is mocked in-browser via `mediators.js` files. Switching to real API = flip `USE_MOCK = false` in each mediator.

---

## 2. Architecture — Feature-Based (Domain-Driven)

Every feature owns its slice, endpoints, mediators, thunks, and components. No shared "endpoints.js" or "services/" at the top level.

### Layer responsibilities

| Layer | File | Purpose | Knows about |
|---|---|---|---|
| **Endpoints** | `features/<x>/endpoints.js` | URL + HTTP method constants per feature | Nothing |
| **Mediators** | `features/<x>/mediators.js` | Thin axios wrappers + mock data | `api/axiosInstance`, feature endpoints |
| **Slice** | `features/<x>/*Slice.js` | Redux state shape + reducers + selectors | Nothing (pure) |
| **Thunks** | `features/<x>/*Thunks.js` | Orchestrate: call mediator → dispatch slice actions | Mediators, slice actions |
| **Component** | `*.jsx` | UI only | Thunks, selectors, hooks |

**Rule:** Components never import axios. Mediators never dispatch. Slices never call APIs.

---

## 3. Folder Structure

```
src/
├── api/
│   ├── axiosConfig.js          # baseURL, withCredentials: true
│   └── axiosInstance.js        # axios instance + refresh interceptor + injectStore()
│
├── components/
│   ├── common/                 # Button, Input, Modal, Spinner, ConfirmDialog, NotFound
│   ├── layout/                 # Header, TopBar, CategoryBar, GlobalSearch, AdminSidebar, AdminHeader
│   └── ui/                     # Card, RatingStars, PriceTag (generic, non-domain)
│
├── features/
│   ├── auth/
│   │   ├── endpoints.js
│   │   ├── mediators.js        # USE_MOCK = true
│   │   ├── authSlice.js
│   │   ├── authThunks.js
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── ForgotPassword.jsx
│   │
│   ├── products/
│   │   ├── endpoints.js
│   │   ├── mediators.js        # USE_MOCK = true, 24 dummy products
│   │   ├── productSlice.js
│   │   ├── productThunks.js
│   │   └── components/
│   │       └── ProductCard.jsx
│   │
│   ├── home/
│   │   ├── Home.jsx            # customer landing page
│   │   └── components/
│   │       ├── HeroBanner.jsx
│   │       └── ProductSection.jsx
│   │
│   └── admin/
│       ├── dashboard/
│       │   ├── Dashboard.jsx
│       │   └── StatCard.jsx
│       ├── products/
│       │   ├── endpoints.js    # /admin/products
│       │   ├── mediators.js    # USE_MOCK = true, in-memory CRUD
│       │   ├── adminProductSlice.js
│       │   ├── adminProductThunks.js
│       │   ├── ProductsPage.jsx
│       │   └── components/
│       │       ├── ProductTable.jsx
│       │       └── ProductFormModal.jsx
│       └── categories/
│           ├── endpoints.js
│           ├── mediators.js    # USE_MOCK = true, in-memory CRUD
│           ├── categorySlice.js
│           ├── categoryThunks.js
│           ├── CategoriesPage.jsx
│           └── components/
│               ├── CategoryTable.jsx
│               └── CategoryFormModal.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useDebounce.js
│   └── useWindowSize.js
│
├── layouts/
│   ├── CustomerLayout.jsx      # Header + Outlet
│   ├── AuthLayout.jsx          # centered card
│   └── AdminLayout.jsx         # AdminSidebar + AdminHeader + Outlet
│
├── redux/
│   ├── store.js                # configureStore + injectStore(store)
│   └── rootReducer.js          # combineReducers
│
├── routes/
│   ├── AppRouter.jsx
│   ├── PrivateRoute.jsx        # role-gated guard
│   ├── PublicRoute.jsx         # redirect-if-logged-in
│   ├── routePaths.js           # ROUTES constant
│   └── HomeRedirect.jsx        # admin → /admin/dashboard, else <Home/>
│
├── styles/
│   ├── tokens.css              # CSS variables (single source of truth)
│   ├── globals.css             # resets, .container-x, .no-scrollbar
│   └── index.css               # imports tokens + globals + @tailwind
│
├── utils/
│   ├── constants.js            # ROLES, TOKEN_KEY (unused now)
│   ├── formatCurrency.js       # Intl.NumberFormat INR
│   └── validators.js
│
└── main.jsx                    # Provider + Bootstrapper + AppRouter
```

---

## 4. Design Token System (the "consistency" backbone)

**Everything** — colors, font sizes, weights, radii, shadows, layout — comes from CSS variables in `src/styles/tokens.css`.

### `src/styles/tokens.css`

```css
:root {
  /* BRAND */
  --color-brand:       #0d7a4f;
  --color-brand-dark:  #0a5f3d;
  --color-brand-soft:  #e8f5ef;
  --color-accent:      #f59e0b;
  --color-danger:      #ef4444;

  /* NEUTRALS */
  --color-ink:         #0f172a;
  --color-muted:       #64748b;
  --color-subtle:      #94a3b8;
  --color-bg:          #f8fafc;
  --color-surface:     #ffffff;
  --color-border:      #e2e8f0;
  --color-hover:       #f1f5f9;

  /* TYPOGRAPHY */
  --font-sans: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;
  --text-3xl:  1.875rem;
  --text-4xl:  2.25rem;
  --leading-tight:   1.2;
  --leading-normal:  1.5;
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;

  /* RADIUS */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;

  /* SHADOWS */
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.12);

  /* LAYOUT */
  --container-max: 1280px;
  --header-h: 72px;
  --topbar-h: 36px;
  --chipbar-h: 56px;
}
```

### Tailwind maps every token

`tailwind.config.js` exposes these as Tailwind classes:

- **Colors:** `bg-brand`, `text-ink`, `border-border`, `bg-surface`, `text-muted`, `text-subtle`, `bg-hover`, `bg-brand-soft`, `text-danger`, `text-accent`
- **Font sizes:** `text-xs` … `text-4xl` all resolve to `var(--text-*)`
- **Radii:** `rounded-sm|md|lg|xl`
- **Shadows:** `shadow-sm|md|lg`
- **Layout:** `max-w-container`

### Reskin rule

Change `--color-brand` in `tokens.css` → **entire app** (buttons, chips, sidebar active states, stars, badges, hero) recolors. Zero component edits.

Change `--text-*` scale → **all text** resizes proportionally. Zero component edits.

### Component convention

- **Never hardcode a color.** No `bg-green-500`, no `#0d7a4f`. Only `bg-brand`, `text-ink`, etc.
- **Never hardcode a size.** No `text-[15px]`. Only token classes.
- **Never hardcode radius.** No `rounded-[8px]`. Use `rounded-md`.
- **Only exception:** layout-only magic numbers (e.g. `w-10 h-10` for icon containers, `h-48` for image area) are fine.

---

## 5. API Layer

### `src/api/axiosConfig.js`

```js
export const axiosConfig = {
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  timeout: 15000,
  withCredentials: true,     // sends httpOnly cookies (auth tokens)
  headers: { "Content-Type": "application/json" },
};
```

### `src/api/axiosInstance.js`

- Creates the shared axios instance.
- Exposes `injectStore(store)` — called once in `store.js` so the interceptor can dispatch `logout` when refresh fails.
- **Response interceptor:**
  - On `401` (and not on `/auth/refresh`, and not already retried):
    - If already refreshing → queue the request.
    - Else → POST `/auth/refresh` (cookies only, no body). On success → retry queued + original. On failure → `dispatch(logout())` + redirect `/login`.
  - **Guard:** skips the flow if `!error.response` (network error / mock mode).

### Auth storage policy

- **Tokens are NOT stored in localStorage or Redux.** They live in httpOnly cookies set by the backend.
- Redux stores **only** `auth.user` (`{ id, name, email, role }`).
- Frontend never touches the token. `withCredentials: true` + backend cookie = done.

---

## 6. Feature Pattern (the standard every feature follows)

### `endpoints.js`
```js
export const X = {
  LIST:   { method: "GET",    url: "/x" },
  CREATE: { method: "POST",   url: "/x" },
  UPDATE: { method: "PUT",    url: (id) => `/x/${id}` },
  DELETE: { method: "DELETE", url: (id) => `/x/${id}` },
};
```

### `mediators.js`
```js
import api from "../../api/axiosInstance";
import { X } from "./endpoints";

const USE_MOCK = true;

const call = ({ method, url }, { data, params, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  return api({ method, url: resolvedUrl, data, params }).then((r) => r.data);
};

export const listX   = async () => USE_MOCK ? MOCK_X : call(X.LIST);
export const createX = async (payload) => USE_MOCK ? {...} : call(X.CREATE, { data: payload });
export const updateX = async (id, payload) => USE_MOCK ? {...} : call(X.UPDATE, { data: payload, args: [id] });
export const deleteX = async (id) => USE_MOCK ? {...} : call(X.DELETE, { args: [id] });
```

### Slice shape (standard)
```js
{
  items: [],
  loading: false,
  submitting: false,
  error: null,
  formOpen: false,     // modal visibility
  editing: null,       // current edit target, null = create
}
```

### Thunk shape (standard)
```js
export const fetchXThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try { dispatch(fetchSuccess(await listX())); }
  catch (e) { dispatch(fetchFailure(e.response?.data?.message || "Failed")); }
};

export const createXThunk = (payload) => async (dispatch) => {
  dispatch(submitStart());
  try {
    const created = await createX(payload);
    dispatch(addItem(created));
    dispatch(closeForm());
  } finally { dispatch(submitEnd()); }
};
```

### Page shape (standard)
```jsx
export default function XPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectX);
  const loading = useSelector(selectXLoading);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { dispatch(fetchXThunk()); }, [dispatch]);

  return (
    <div className="space-y-5">
      {/* header: title + "+ Add" button that dispatches openForm(null) */}
      {/* table via XTable onEdit={openForm(p)} onDelete={setDeleting} */}
      <XFormModal />
      <ConfirmDialog open={!!deleting} ... />
    </div>
  );
}
```

---

## 7. Auth Flow

### Redux state (`auth`)
```js
{
  user: null,           // { id, name, email, role: "customer" | "admin" }
  status: "idle",       // idle | loading | authenticated | error
  error: null,
  bootstrapped: false,  // has silent refresh run on app mount?
}
```

### Endpoints
| Method | URL | Body | Returns |
|---|---|---|---|
| POST | `/auth/login` | `{email, password}` | `{ user }` (cookies set by server) |
| POST | `/auth/signup` | `{name, email, password}` | `{ user }` (cookies set) |
| POST | `/auth/refresh` | — (cookies only) | `{ user }` |
| POST | `/auth/logout` | — | `{ ok: true }` |
| GET | `/auth/me` | — | `{ user }` |
| POST | `/auth/forgot-password` | `{email}` | `{ ok: true }` |

### Mock behavior (`USE_MOCK = true`)
- **login:** email containing `"admin"` → `role: "admin"`, else `role: "customer"`. Mock ignores password.
- **signup:** always `role: "customer"`.
- **refresh:** reads `sessionStorage.mock_user`; throws `"no-session"` if absent.
- **logout:** clears `sessionStorage.mock_user`.
- **forgotPassword:** returns `{ ok: true }` immediately.

**Login test:**
- `admin@test.com` / anything → admin → redirect `/admin/dashboard`
- `user@test.com` / anything → customer → redirect `/`

### Boot flow
`main.jsx` wraps app in `<Bootstrapper>`:
1. On mount → `dispatch(bootstrapAuthThunk())`
2. Thunk calls `refresh()`
   - Success → `authSuccess({ user })`
   - Failure → silent (guest)
   - Always → `setBootstrapped(true)`
3. While `!bootstrapped` → render `<div>Loading…</div>`
4. When ready → render `<AppRouter />`

### Guards
- **`PrivateRoute`** — no `auth.user` → `/login` with `state.from`. Optional `allowedRoles` prop.
- **`PublicRoute`** — authed → `/`.
- **`HomeRedirect`** — `user.role === "admin"` → `/admin/dashboard`, else `<Home />`.

---

## 8. Routes

```js
export const ROUTES = {
  HOME:             "/",
  LOGIN:            "/login",
  SIGNUP:           "/signup",
  FORGOT_PASSWORD:  "/forgot-password",

  ADMIN:            "/admin",
  ADMIN_DASH:       "/admin/dashboard",
  ADMIN_PRODUCTS:   "/admin/products",
  ADMIN_CATEGORIES: "/admin/categories",
};
```

### Router structure
```
<BrowserRouter>
  <CustomerLayout>                       ← Header + Outlet
    HOME          → <HomeRedirect />       (admin → dashboard, else storefront)
  </CustomerLayout>

  <PublicRoute>                          ← redirect if logged in
    <AuthLayout>
      LOGIN, SIGNUP, FORGOT_PASSWORD
    </AuthLayout>
  </PublicRoute>

  <PrivateRoute allowedRoles={["admin"]}>
    <AdminLayout>                        ← Sidebar + Header + Outlet
      ADMIN            → Navigate to ADMIN_DASH
      ADMIN_DASH       → <Dashboard />
      ADMIN_PRODUCTS   → <ProductsPage />
      ADMIN_CATEGORIES → <CategoriesPage />
    </AdminLayout>
  </PrivateRoute>

  * → 404
</BrowserRouter>
```

---

## 9. Customer Flow

### Layout: `CustomerLayout`
```
<TopBar />          green bar, links (About Us, Compare, Blog, FAQ, Contact), Order Tracking
<Header />          sticky, contains:
  ├── Logo (Leveline / Shopcart)
  ├── Nav (Categories, Deals, What's New, Delivery)
  ├── <GlobalSearch />   pill input + dropdown product grid below header
  └── Login/Account, Cart (badge)
<CategoryBar />     chips (Headphone type, Price, Review, Color, Material, Offer) + All Filters
<main><Outlet /></main>
```

### Pages
- **`/` (Home)** — `HeroBanner` (green soft bg, "Grab Upto 50% Off", Buy Now button) + 3 `ProductSection`s (Deals of the Day / Trending Now / Recommended) — 10 products each, sliced from the 24-item mock.
- **Search** — GlobalSearch debounced 300ms → `searchProductsThunk` → dropdown with up to 8 `ProductCard`s. Click-outside closes. Empties on query clear.

### `ProductCard` anatomy
- 192px fixed image container, `object-contain`, hover scale 1.05
- Heart button top-right (hover danger)
- Title 2-line clamp, `min-h-[2.5rem]`
- Price (bold) + strikethrough MRP (1.4×)
- 5-star + count (currently static 4.5 / 120)
- "Add to Cart" button (hover → brand bg)

---

## 10. Admin Flow

### Layout: `AdminLayout`
```
<AdminSidebar />    dark (bg-ink), logo, nav: Dashboard / Products / Categories (brand when active)
<div flex-1>
  <AdminHeader />   page title + "Hi, {name}" + Logout button
  <main>{Outlet}</main>
</div>
```

### Pages

**Dashboard** — 4 StatCards (Total Products, Total Categories, Orders, Revenue) + Quick actions panel.
- Products count from `state.adminProducts.items.length`
- Categories count from `state.categories.items.length`
- Orders / Revenue are placeholder "—"

**ProductsPage** (`/admin/products`)
- Header: `N products` + "+ Add Product"
- `ProductTable`: image + title / category / price / stock badge / Edit · Delete
- `ProductFormModal`: Title, Price, Stock, Category (select), Image URL (optional, defaults to `picsum.photos/seed/{Date.now()}`)
- `ConfirmDialog` on delete
- **Mock:** in-memory array of 5 products; resets on full page reload

**CategoriesPage** (`/admin/categories`)
- Header: `N categories` + "+ Add Category"
- `CategoryTable`: name / slug (mono) / count badge / Edit · Delete
- `CategoryFormModal`: Name, Slug (auto-slugified from name if empty)
- **Mock:** in-memory array of 4 categories

### Standard CRUD pattern
Every admin CRUD page uses the **same four files**:
- `endpoints.js` — LIST / CREATE / UPDATE / DELETE
- `mediators.js` — `USE_MOCK` + mock array + `list/create/update/delete`
- `*Slice.js` — items, loading, submitting, formOpen, editing + reducers (`fetch*`, `openForm`, `closeForm`, `addItem`, `updateItem`, `removeItem`)
- `*Thunks.js` — `fetch*Thunk`, `create*Thunk`, `update*Thunk`, `delete*Thunk`

---

## 11. Redux Store

### `rootReducer.js`
```js
combineReducers({
  auth:          authReducer,
  products:      productReducer,       // public catalog
  adminProducts: adminProductReducer,  // admin CRUD
  categories:    categoryReducer,      // admin categories
});
```

### `store.js`
```js
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
  devTools: import.meta.env.MODE !== "production",
});

injectStore(store);   // gives axios interceptor access for logout on refresh failure

export default store;
```

---

## 12. Mock Data

### Product catalog (public)
- **Source:** `features/products/mediators.js`
- **Count:** 24 items
- **Shape:** `{ id, title, price, image, category }`
- **Images:** `https://picsum.photos/seed/p{n}/400/400`
- **Categories:** men, women, kids, home, beauty, genz
- **Search:** client-side filter on `title` OR `category`, case-insensitive

### Admin products
- **Source:** `features/admin/products/mediators.js`
- **Shape:** `{ id, title, price, category, stock, image }`
- **Seed:** 5 items
- **CRUD:** in-memory, resets on reload

### Admin categories
- **Source:** `features/admin/categories/mediators.js`
- **Shape:** `{ id, name, slug, count }`
- **Seed:** 4 items (men, women, kids, beauty)
- **CRUD:** in-memory, resets on reload

### Auth
- **Source:** `features/auth/mediators.js`
- **Session persistence:** `sessionStorage.mock_user` (survives refresh, cleared on tab close)

---

## 13. Styling Conventions (strict)

### Class composition rules
- Order: **layout → spacing → color → typography → state** (Tailwind recommended order)
- Always use tokens: `text-ink`, `bg-surface`, `border-border`, `text-muted`, `text-subtle`, `bg-hover`, `bg-brand`, `text-brand`, `bg-brand-soft`, `text-danger`
- Radii: `rounded-sm|md|lg|xl` only
- Shadows: `shadow-sm|md|lg` only
- Font sizes: `text-xs|sm|base|lg|xl|2xl|3xl|4xl` only

### Reusable global classes
- `.container-x` — max-width + centered + 1rem x-padding
- `.no-scrollbar` — hides scrollbar (used on CategoryBar chips)

### Common layout patterns
- Card: `bg-surface border border-border rounded-lg`
- Chip: `px-3.5 py-1.5 text-xs font-medium rounded-full border border-border hover:border-brand hover:text-brand`
- Primary button: `bg-brand text-white font-semibold rounded-md px-4 py-2 hover:bg-brand-dark transition`
- Ghost button: `border border-border rounded-md hover:bg-hover`
- Danger button: `bg-danger text-white rounded-md hover:opacity-90`

### Iconography
- Inline SVGs (no icon library at build time — `react-icons` is installed but SVGs are hand-rolled for consistency)
- Default stroke: `stroke="currentColor" strokeWidth="2"`
- Standard sizes: 12px (stars), 14px (heart, filter), 16px (search, sidebar nav), 18-20px (header actions)

---

## 14. Hooks

- **`useAuth()`** — `{ user, isAuthenticated, isAdmin }`
- **`useDebounce(value, delay=300)`** — returns debounced value
- **`useWindowSize()`** — `{ width, height }`

---

## 15. Utilities

- **`formatCurrency(n, currency="INR", locale="en-IN")`** — Intl-based, no decimals
- **`validators.js`** — `isEmail`, `isStrongPassword`, `required`
- **`constants.js`** — `ROLES = { CUSTOMER: "customer", ADMIN: "admin" }`

---

## 16. Environment

`.env`:
```
VITE_API_URL=http://localhost:4000/api
```

The backend contract (when built):
- Sets `access_token` (short-lived) + `refresh_token` (long-lived) as **httpOnly cookies** on login/signup
- `/auth/refresh` reads refresh cookie, sets new access cookie, returns `{ user }`
- `/auth/logout` clears cookies
- CORS: `{ origin: "http://localhost:5173", credentials: true }`

---

## 17. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `ProductCard.jsx` |
| Feature folder | lowercase singular | `features/product/` |
| Slice file | camelCase + Slice | `productSlice.js` |
| Thunks file | camelCase + Thunks | `productThunks.js` |
| Mediators | camelCase verbs | `getProducts`, `createProduct` |
| Endpoints constant | UPPER_SNAKE object | `export const PRODUCTS = {...}` |
| Selectors | `select` prefix | `selectProducts` |
| Thunks | `Thunk` suffix | `fetchProductsThunk` |
| Redux actions | verb-first | `fetchStart`, `authSuccess`, `openForm` |
| CSS vars | `--kebab-case` | `--color-brand`, `--text-lg` |

---

## 18. Current Status

**Working:**
- Full auth flow (mock) — login, signup, forgot, bootstrap, logout, guards
- Customer home — hero + 3 product sections + global search with dropdown
- Admin panel — dashboard stats, products CRUD, categories CRUD (all mock)
- Design token system — change `--color-brand` → whole app recolors
- Route guards — role-based admin access, redirect-if-authed on auth pages, admin → dashboard on `/`

**Not built yet:**
- Cart (slice, drawer/page, add/remove, badge count)
- Wishlist (slice, page, heart persistence)
- Product detail page (`/products/:id`)
- Orders flow (checkout, order list, order detail)
- Admin orders view
- Admin analytics
- Real backend integration (flip `USE_MOCK = false`)
- Notifications (react-hot-toast installed, not wired)
- Category filtering on home (chips are visual-only)

---

## 19. When Modifying This Codebase — Rules

1. **Never hardcode colors or sizes.** Use tokens.
2. **Never import axios in a component.** Use mediators.
3. **Never dispatch from a mediator.** Mediators are dumb I/O.
4. **Never put URL strings in thunks or components.** Only in `endpoints.js`.
5. **New feature = 4 files:** `endpoints.js`, `mediators.js`, `*Slice.js`, `*Thunks.js`. Same shape every time.
6. **Shared UI** → `components/ui/`. **Layout chrome** → `components/layout/`. **Primitives** → `components/common/`. **Domain-specific** → `features/<x>/components/`.
7. **Modals** use the shared `components/common/Modal.jsx`. Deletes use `ConfirmDialog`.
8. **Admin forms** are modal-based (`openForm(null)` for create, `openForm(item)` for edit).
9. **Mock data lives in mediators**, never in components or slices.
10. **Test both roles:** login as `admin@test.com` and `user@test.com`.

---

## 20. Quick Reference — Common Tasks

**Add a new admin CRUD page:**
1. Create `features/admin/<name>/` with the 4 standard files
2. Add reducer to `rootReducer.js`
3. Add route to `routePaths.js` and `AppRouter.jsx`
4. Add link to `AdminSidebar.jsx`
5. Add title to `AdminHeader.jsx`'s `TITLES` map

**Change brand color:**
Edit `--color-brand` + `--color-brand-dark` + `--color-brand-soft` in `tokens.css`. Done.

**Change typography scale:**
Edit `--text-*` variables in `tokens.css`. Done.

**Wire real backend:**
In each mediator, set `USE_MOCK = false`. Set `VITE_API_URL` in `.env`. Ensure backend sets httpOnly cookies.

**Add a new Redux slice:**
Add reducer to `rootReducer.js`. Follow the standard shape: `items, loading, submitting, error, formOpen, editing`.

**Add a new route:**
Add path to `routePaths.js`. Add `<Route>` in `AppRouter.jsx`. If protected, wrap in `PrivateRoute allowedRoles={[...]}`.

---

**End of context.** Everything in this document reflects the current state of the codebase. Any file that deviates from these patterns should be refactored to match.