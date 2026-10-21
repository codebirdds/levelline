import {
  listContacts,
  updateContactStatus,
} from "../../contact/mediators";
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  updateOne,
} from "./adminContactSlice";

export const fetchAdminContactsThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await listContacts();
    dispatch(fetchSuccess(res?.data || res || []));
  } catch (err) {
    dispatch(
      fetchFailure(err.response?.data?.message || "Failed to load contacts")
    );
  }
};

export const changeContactStatusThunk = (id, status) => async (dispatch) => {
  try {
    const res = await updateContactStatus(id, status);
    dispatch(updateOne(res?.data || res));
  } catch (err) {
    // you can add an error toast here
    throw err;
  }
};