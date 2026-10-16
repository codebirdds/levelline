import { createContact } from "./mediators";
import { submitStart, submitSuccess, submitFailure } from "./contactSlice";

export const submitContactThunk = (form) => async (dispatch) => {
  dispatch(submitStart());
  try {
    const data = await createContact(form);
    dispatch(submitSuccess());
    return data;
  } catch (err) {
    const msg = err.response?.data?.message || "Could not submit your request";
    dispatch(submitFailure(msg));
    throw new Error(msg);
  }
};