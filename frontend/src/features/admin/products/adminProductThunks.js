import * as api from "./mediators";
import {
  fetchStart, fetchSuccess, fetchFailure,
  submitStart, submitEnd,
  addItem, updateItem, removeItem, closeForm,
} from "./adminProductSlice";

export const fetchAdminProductsThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await api.listProducts();
    dispatch(fetchSuccess(data));
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to load products"));
  }
};

export const createProductThunk = (payload) => async (dispatch) => {
  dispatch(submitStart());
  try {
    const created = await api.createProduct(payload);
    dispatch(addItem(created));
    dispatch(closeForm());
  } finally {
    dispatch(submitEnd());
  }
};

export const updateProductThunk = (id, payload) => async (dispatch) => {
  dispatch(submitStart());
  try {
    const updated = await api.updateProduct(id, payload);
    dispatch(updateItem(updated));
    dispatch(closeForm());
  } finally {
    dispatch(submitEnd());
  }
};

export const deleteProductThunk = (id) => async (dispatch) => {
  await api.deleteProduct(id);
  dispatch(removeItem(id));
};