import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routePaths";
import PrivateRoute from "./PrivateRoute";
import PublicRoute  from "./PublicRoute";

import CustomerLayout from "../layouts/CustomerLayout";
import AuthLayout     from "../layouts/AuthLayout";
import AdminLayout    from "../layouts/AdminLayout";

import HomeRedirect from "./HomeRedirect";   // ← new import
import Login          from "../features/auth/Login";
import Signup         from "../features/auth/Signup";
import ForgotPassword from "../features/auth/ForgotPassword";

import Dashboard      from "../features/admin/dashboard/Dashboard";
import ProductsPage   from "../features/admin/products/ProductsPage";
import CategoriesPage from "../features/admin/categories/CategoriesPage";
import ReadyToWear    from "../features/readytowear/ReadyToWear";  // ← new import
import ProductDetail  from "../features/readytowear/components/ProductDetail";  // ← new import
import Checkout from "../features/checkout/Checkout";
import Fabric from "../features/fabric/Fabric";   // ← top of file

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CustomerLayout scrolled={false} />}>
          <Route path={ROUTES.HOME} element={<HomeRedirect />} />
          <Route path={ROUTES.READY_TO_WEAR} element={<ReadyToWear />} />
          <Route path={ROUTES.FABRIC} element={<Fabric />} />
        </Route>
          <Route path={ROUTES.READY_TO_WEAR_DETAIL} element={<ProductDetail />} />   {/* ← new */}
          <Route path={ROUTES.CHECKOUT} element={<Checkout />} />

        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN}           element={<Login />} />
            <Route path={ROUTES.SIGNUP}          element={<Signup />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN}            element={<Navigate to={ROUTES.ADMIN_DASH} replace />} />
            <Route path={ROUTES.ADMIN_DASH}       element={<Dashboard />} />
            <Route path={ROUTES.ADMIN_PRODUCTS}   element={<ProductsPage />} />
            <Route path={ROUTES.ADMIN_CATEGORIES} element={<CategoriesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<div className="p-8 text-center">404</div>} />
      </Routes>
    </BrowserRouter>
  );
}