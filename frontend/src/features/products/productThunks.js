import * as productApi from "./mediators";
import {
  fetchStart, fetchSuccess, fetchFailure,
  searchStart, searchSuccess, searchClear,
} from "./productSlice";

export const fetchProductsThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await productApi.getProducts();
    dispatch(fetchSuccess(data));
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to load products"));
  }
};

export const searchProductsThunk = (q) => async (dispatch) => {
  if (!q?.trim()) {
    dispatch(searchClear());
    return;
  }
  dispatch(searchStart());
  try {
    const data = await productApi.searchProducts(q);
    dispatch(searchSuccess(data));
  } catch {
    dispatch(searchClear());
  }
};