import { listReadyToWear } from "./mediators";
import { fetchStart, fetchSuccess, fetchFailure } from "./readyToWearSlice";

export const fetchReadyToWearThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    dispatch(fetchSuccess(await listReadyToWear()));
  } catch (e) {
    dispatch(fetchFailure(e.response?.data?.message || "Failed to load collection"));
  }
};
