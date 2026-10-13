import * as api from "./mediators";
import {
  fetchStart, fetchSuccess, fetchFailure,
  submitStart, submitEnd,
  addItem, updateItem, removeItem, closeForm,
} from "./variantSlice";

export const fetchVariantsThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await api.listVariants();
    dispatch(fetchSuccess(data));
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to load variants"));
  }
};

export const fetchVariantsByProductThunk = (productId) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await api.listVariantsByProduct(productId);
    dispatch(fetchSuccess(data));
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to load variants"));
  }
};

export const createVariantThunk = (payload) => async (dispatch) => {
  dispatch(submitStart());
  try {
    const created = await api.createVariant(payload);
    dispatch(addItem(created.data || created));
    dispatch(closeForm());
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to create variant"));
  } finally {
    dispatch(submitEnd());
  }
};

export const updateVariantThunk = (id, payload) => async (dispatch) => {
  dispatch(submitStart());
  try {
    const updated = await api.updateVariant(id, payload);
    dispatch(updateItem(updated.data || updated));
    dispatch(closeForm());
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to update variant"));
  } finally {
    dispatch(submitEnd());
  }
};

export const deleteVariantThunk = (id) => async (dispatch) => {
  try {
    await api.deleteVariant(id);
    dispatch(removeItem(id));
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to delete variant"));
  }
};