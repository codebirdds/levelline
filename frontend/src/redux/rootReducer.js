import { combineReducers } from "@reduxjs/toolkit";
import authReducer            from "../features/auth/authSlice";
import productReducer         from "../features/products/productSlice";
import adminProductReducer    from "../features/admin/products/adminProductSlice";
import categoryReducer        from "../features/admin/categories/categorySlice";

const rootReducer = combineReducers({
  auth:          authReducer,
  products:      productReducer,
  adminProducts: adminProductReducer,
  categories:    categoryReducer,
});

export default rootReducer;