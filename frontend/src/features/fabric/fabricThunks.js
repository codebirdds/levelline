import { createAsyncThunk } from "@reduxjs/toolkit";
import { listFabric } from "./mediators";
import { setItems, setLoading, setError } from "./fabricSlice";

export const fetchFabricThunk = createAsyncThunk(
  "fabric/fetchAll",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const data = await listFabric();
      dispatch(setItems(data));
      return data;
    } catch (err) {
      dispatch(setError(err?.message || "Failed to load fabrics"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }
);