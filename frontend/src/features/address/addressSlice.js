import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as addressApi from "./addressMediators";

const initialState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  selectedId: null,
  formOpen: false,
  editing: null,
};

export const fetchAddressesThunk = createAsyncThunk(
  "address/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await addressApi.listAddresses();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load addresses");
    }
  }
);

export const createAddressThunk = createAsyncThunk(
  "address/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await addressApi.createAddress(payload);
      return res.data || res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create address");
    }
  }
);

export const updateAddressThunk = createAsyncThunk(
  "address/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await addressApi.updateAddress(id, payload);
      return res.data || res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update address");
    }
  }
);

export const deleteAddressThunk = createAsyncThunk(
  "address/delete",
  async (id, { rejectWithValue }) => {
    try {
      await addressApi.deleteAddress(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete address");
    }
  }
);

export const setDefaultAddressThunk = createAsyncThunk(
  "address/setDefault",
  async (id, { rejectWithValue }) => {
    try {
      const res = await addressApi.setDefaultAddress(id);
      return res.data || res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to set default address");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    selectAddress: (s, { payload }) => { s.selectedId = payload; },
    clearAddresses: (s) => { s.items = []; s.selectedId = null; },
    openForm: (s, { payload = null }) => { s.formOpen = true; s.editing = payload; },
    closeForm: (s) => { s.formOpen = false; s.editing = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressesThunk.pending, (s) => { s.loading = true; })
      .addCase(fetchAddressesThunk.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.items = payload;
        if (!s.selectedId) {
          const def = payload.find((a) => a.is_default);
          if (def) s.selectedId = def.id;
        }
      })
      .addCase(fetchAddressesThunk.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })
      .addCase(createAddressThunk.pending, (s) => { s.submitting = true; })
      .addCase(createAddressThunk.fulfilled, (s, { payload }) => {
        s.submitting = false;
        s.items = [payload, ...s.items];
        if (payload.is_default) s.selectedId = payload.id;
        s.formOpen = false;
        s.editing = null;
      })
      .addCase(createAddressThunk.rejected, (s, { payload }) => {
        s.submitting = false;
        s.error = payload;
      })
      .addCase(updateAddressThunk.pending, (s) => { s.submitting = true; })
      .addCase(updateAddressThunk.fulfilled, (s, { payload }) => {
        s.submitting = false;
        s.items = s.items.map((a) => (a.id === payload.id ? payload : a));
        if (payload.is_default) s.selectedId = payload.id;
        s.formOpen = false;
        s.editing = null;
      })
      .addCase(updateAddressThunk.rejected, (s, { payload }) => {
        s.submitting = false;
        s.error = payload;
      })
      .addCase(deleteAddressThunk.fulfilled, (s, { payload }) => {
        s.items = s.items.filter((a) => a.id !== payload);
        if (s.selectedId === payload) {
          const def = s.items.find((a) => a.is_default);
          s.selectedId = def ? def.id : (s.items[0]?.id || null);
        }
      })
      .addCase(setDefaultAddressThunk.fulfilled, (s, { payload }) => {
        s.items = s.items.map((a) => ({
          ...a,
          is_default: a.id === payload.id,
        }));
        s.selectedId = payload.id;
      });
  },
});

export const { selectAddress, clearAddresses, openForm, closeForm } = addressSlice.actions;

export const selectAddresses = (s) => s.address.items;
export const selectAddressLoading = (s) => s.address.loading;
export const selectAddressError = (s) => s.address.error;
export const selectSelectedAddressId = (s) => s.address.selectedId;
export const selectSelectedAddress = (s) => {
  const id = s.address.selectedId;
  return s.address.items.find((a) => a.id === id) || s.address.items[0] || null;
};
export const selectDefaultAddress = (s) =>
  s.address.items.find((a) => a.is_default) || s.address.items[0] || null;
export const selectAddressFormOpen = (s) => s.address.formOpen;
export const selectAddressEditing = (s) => s.address.editing;
export const selectSubmitting = (s) => s.address.submitting;

export default addressSlice.reducer;