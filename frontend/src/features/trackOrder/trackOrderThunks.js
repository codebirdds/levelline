import { createAsyncThunk } from "@reduxjs/toolkit";
import * as orderApi from "./mediators";

export const fetchMyOrdersThunk = createAsyncThunk(
  "trackOrder/fetchOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await orderApi.listMyOrders({ page: params.page || 1, limit: params.limit || 50 });
      return { orders: response?.data || [], pagination: response?.pagination || null };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Unable to load your orders.");
    }
  }
);

export const fetchMyOrderThunk = createAsyncThunk(
  "trackOrder/fetchOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderApi.getMyOrder(id);
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Unable to load this order.");
    }
  }
);

export const cancelMyOrderThunk = createAsyncThunk(
  "trackOrder/cancelOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderApi.cancelMyOrder(id);
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Unable to cancel this order.");
    }
  }
);
