import { combineReducers } from "@reduxjs/toolkit";
import authReducer            from "../features/auth/authSlice";
import productReducer         from "../features/products/productSlice";
import adminProductReducer    from "../features/admin/products/adminProductSlice";
import categoryReducer        from "../features/admin/categories/categorySlice";
import variantReducer         from "../features/admin/variants/variantSlice";
import cartReducer            from "../features/cart/cartSlice";
import addressReducer         from "../features/address/addressSlice";
import readyToWearReducer     from "../features/readytowear/readyToWearSlice";
import checkoutReducer from "../features/checkout/checkoutSlice";
import fabricReducer from "../features/fabric/fabricSlice";
import trackOrderReducer from "../features/trackOrder/trackOrderSlice";
import contactReducer from "../features/contact/contactSlice";
import adminContactReducer from "../features/admin/contacts/adminContactSlice";

const rootReducer = combineReducers({
  auth:          authReducer,
  products:      productReducer,
  adminProducts: adminProductReducer,
  categories:    categoryReducer,
  variants:      variantReducer,
  cart:          cartReducer,
  address:       addressReducer,
  readyToWear:   readyToWearReducer,
  checkout:        checkoutReducer,
  fabric: fabricReducer,
  trackOrder: trackOrderReducer,
  contact: contactReducer,
});

export default rootReducer;
