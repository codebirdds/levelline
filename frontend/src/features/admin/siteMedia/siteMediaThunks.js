import * as api from "./mediators";
import {
  fetchStart, fetchSuccess, fetchFailure,
  submitStart, submitEnd,
  addItem, updateItem, removeItem, closeModal,
} from "./siteMediaSlice";

export const fetchMediaThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await api.listMedia();
    dispatch(fetchSuccess(data));
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to load media"));
  }
};

export const createMediaThunk = (payload) => async (dispatch) => {
  dispatch(submitStart());
  try {
    const created = await api.createMedia(payload);
    dispatch(addItem(created.data || created));
    dispatch(closeModal());
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to create"));
  } finally {
    dispatch(submitEnd());
  }
};

export const updateMediaThunk = (id, payload) => async (dispatch) => {
  dispatch(submitStart());
  try {
    const updated = await api.updateMedia(id, payload);
    dispatch(updateItem(updated.data || updated));
    dispatch(closeModal());
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to update"));
  } finally {
    dispatch(submitEnd());
  }
};

export const deleteMediaThunk = (id) => async (dispatch) => {
  try {
    await api.deleteMedia(id);
    dispatch(removeItem(id));
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to delete"));
  }
};
