import { listReadyToWear } from "./mediators";
import { fetchStart, fetchSuccess, fetchFailure } from "./readyToWearSlice";

export const fetchReadyToWearThunk = ({ category_id, sort } = {}) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await listReadyToWear({ category_id, sort });
    dispatch(fetchSuccess(data));
  } catch (e) {
    dispatch(fetchFailure(e.response?.data?.message || "Failed to load collection"));
  }
};