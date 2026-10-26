import * as api from "./mediators";
import {
  fetchStart, fetchSuccess, fetchFailure,
  submitStart, submitEnd,
  updateItem, closeModal,
} from "./contactsSlice";

export const fetchContactsThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await api.listContacts();
    dispatch(fetchSuccess(data.data || data));
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to load contacts"));
  }
};

export const updateContactStatusThunk = (id, status) => async (dispatch) => {
  dispatch(submitStart());
  try {
    await api.updateContactStatus(id, status);
    dispatch(updateItem({ id, status }));
    dispatch(closeModal());
  } catch (err) {
    dispatch(fetchFailure(err.response?.data?.message || "Failed to update status"));
  } finally {
    dispatch(submitEnd());
  }
};
