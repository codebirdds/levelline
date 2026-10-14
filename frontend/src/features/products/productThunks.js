import * as productApi from "./mediators";
import {
  fetchStart, fetchSuccess, fetchFailure,
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