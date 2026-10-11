import { combineReducers } from "@reduxjs/toolkit";
import authReducer            from "../features/auth/authSlice";
import productReducer         from "../features/products/productSlice";
import adminProductReducer    from "../features/admin/products/adminProductSlice";
import categoryReducer        from "../features/admin/categories/categorySlice";
import readyToWearReducer     from "../features/readyToWear/readyToWearSlice";
import checkoutReducer from "../features/checkout/checkoutSlice";
import fabricReducer from "../features/fabric/fabricSlice";

const rootReducer = combineReducers({
  auth:          authReducer,
  products:      productReducer,
  adminProducts: adminProductReducer,
  categories:    categoryReducer,
  readyToWear:   readyToWearReducer,
  checkout:        checkoutReducer,
  fabric: fabricReducer,
});

export default rootReducer;