import { createSlice } from "@reduxjs/toolkit";
import { fetchMyOrderThunk, fetchMyOrdersThunk } from "./trackOrderThunks";

const initialState = {
  orders: [],
  pagination: null,
  selectedOrder: null,
  loading: false,
  detailLoading: false,
  error: null,
  detailError: null,
};

const trackOrderSlice = createSlice({
  name: "trackOrder",
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrdersThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyOrdersThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.orders = payload.orders;
        state.pagination = payload.pagination;
      })
      .addCase(fetchMyOrdersThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Unable to load your orders.";
      })
      .addCase(fetchMyOrderThunk.pending, (state) => { state.detailLoading = true; state.detailError = null; })
      .addCase(fetchMyOrderThunk.fulfilled, (state, { payload }) => {
        state.detailLoading = false;
        state.selectedOrder = payload;
      })
      .addCase(fetchMyOrderThunk.rejected, (state, { payload }) => {
        state.detailLoading = false;
        state.detailError = payload || "Unable to load this order.";
        state.selectedOrder = null;
      });
  },
});

export const { clearSelectedOrder } = trackOrderSlice.actions;
export const selectMyOrders = (state) => state.trackOrder.orders;
export const selectMyOrdersLoading = (state) => state.trackOrder.loading;
export const selectMyOrdersError = (state) => state.trackOrder.error;
export const selectTrackedOrder = (state) => state.trackOrder.selectedOrder;
export const selectTrackedOrderLoading = (state) => state.trackOrder.detailLoading;
export const selectTrackedOrderError = (state) => state.trackOrder.detailError;

export default trackOrderSlice.reducer;
