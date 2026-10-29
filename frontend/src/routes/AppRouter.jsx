import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
import PrivateRoute from "./PrivateRoute";
import PublicRoute  from "./PublicRoute";

import CustomerLayout from "../layouts/CustomerLayout";
import AuthLayout     from "../layouts/AuthLayout";
import AdminLayout    from "../layouts/AdminLayout";

import HomeRedirect from "./HomeRedirect";
import Login          from "../features/auth/Login";
import Signup         from "../features/auth/Signup";
import ForgotPassword from "../features/auth/ForgotPassword";

import Dashboard      from "../features/admin/dashboard/Dashboard";
import ProductsPage   from "../features/admin/products/ProductsPage";
import CategoriesPage from "../features/admin/categories/CategoriesPage";
import VariantsPage   from "../features/admin/variants/VariantsPage";
import OrdersPage from "../features/admin/orders/OrdersPage";
import ReadyToWear    from "../features/readytowear/ReadyToWear";
import ProductDetail  from "../features/readytowear/components/ProductDetail";
import Checkout from "../features/checkout/Checkout";
import TrackOrder from "../features/trackOrder/TrackOrder";
import Fabric from "../features/fabric/Fabric";
import About from "../features/about/About";
import ContactsPage from "../features/admin/contacts/ContactsPage";
import ScrollToTop from "../components/common/ScrollToTop";
import SiteMediaPage from "../features/admin/siteMedia/SiteMediaPage"; // ✅ Import

export default function AppRouter() {
  return (
    <BrowserRouter>
          <ScrollToTop />
      <Routes>
        <Route element={<CustomerLayout scrolled={false} />}>
          <Route path={ROUTES.HOME} element={<HomeRedirect />} />
          <Route path={ROUTES.READY_TO_WEAR} element={<ReadyToWear />} />
          <Route path={ROUTES.FABRIC} element={<Fabric />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
        </Route>
        <Route path={ROUTES.READY_TO_WEAR_DETAIL} element={<ProductDetail />} />
        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path={ROUTES.TRACK_ORDER} element={<TrackOrder />} />
        </Route>

        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN}           element={<Login />} />
            <Route path={ROUTES.SIGNUP}          element={<Signup />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN}            element={<Navigate to={ROUTES.ADMIN_PRODUCTS} replace />} />
            {/* <Route path={ROUTES.ADMIN_DASH}       element={<Dashboard />} /> */}
            <Route path={ROUTES.ADMIN_PRODUCTS}   element={<ProductsPage />} />
            <Route path={ROUTES.ADMIN_CATEGORIES} element={<CategoriesPage />} />
            {/* <Route path={ROUTES.ADMIN_VARIANTS}   element={<VariantsPage />} /> */}
            <Route path={ROUTES.ADMIN_ORDERS}     element={<OrdersPage />} />
            <Route path={ROUTES.ADMIN_CONTACTS} element={<ContactsPage />} />
            <Route path={ROUTES.ADMIN_SITE_MEDIA} element={<SiteMediaPage />} /> // ✅ Add
          </Route>
        </Route>

        <Route path="*" element={<div className="p-8 text-center">404</div>} />
      </Routes>
    </BrowserRouter>
  );
}
