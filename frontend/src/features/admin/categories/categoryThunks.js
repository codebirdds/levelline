import * as api from "./mediators";
import {
  fetchStart, fetchSuccess, fetchFailure,
  submitStart, submitEnd,
  addItem, updateItem, removeItem, closeForm,
} from "./categorySlice";

export const fetchCategoriesThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await api.listCategories();
    dispatch(fetchSuccess(data));
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to load categories"));
  }
};

export const createCategoryThunk = (payload) => async (dispatch) => {
  dispatch(submitStart());
  try {
    const created = await api.createCategory(payload);
    dispatch(addItem(created.data || created));
    dispatch(closeForm());
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to create category"));
  } finally {
    dispatch(submitEnd());
  }
};

export const updateCategoryThunk = (id, payload) => async (dispatch) => {
  dispatch(submitStart());
  try {
    const updated = await api.updateCategory(id, payload);
    dispatch(updateItem(updated.data || updated));
    dispatch(closeForm());
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to update category"));
  } finally {
    dispatch(submitEnd());
  }
};

export const deleteCategoryThunk = (id) => async (dispatch) => {
  try {
    await api.deleteCategory(id);
    dispatch(removeItem(id));
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to delete category"));
  }
};