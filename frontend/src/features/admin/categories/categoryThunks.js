import * as api from "./mediators";
import {
  fetchStart, fetchSuccess, fetchFailure,
  addItem, updateItem, removeItem, closeForm,
} from "./categorySlice";

export const fetchCategoriesThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    dispatch(fetchSuccess(await api.listCategories()));
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to load categories"));
  }
};

export const createCategoryThunk = (payload) => async (dispatch) => {
  const created = await api.createCategory(payload);
  dispatch(addItem(created));
  dispatch(closeForm());
};

export const updateCategoryThunk = (id, payload) => async (dispatch) => {
  const updated = await api.updateCategory(id, payload);
  dispatch(updateItem(updated));
  dispatch(closeForm());
};

export const deleteCategoryThunk = (id) => async (dispatch) => {
  await api.deleteCategory(id);
  dispatch(removeItem(id));
};