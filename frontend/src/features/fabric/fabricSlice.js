import { createSlice } from "@reduxjs/toolkit";
import { FABRIC_CATEGORIES, FABRIC_TABS } from "./constants";

const initialState = {
  items: [],
  loading: false,
  error: null,
  category: FABRIC_CATEGORIES[0],       // "Shirt"
  filter: FABRIC_TABS[0],               // "ALL"
  selectedId: null,
};

const fabricSlice = createSlice({
  name: "fabric",
  initialState,
  reducers: {
    setItems(state, action)      { state.items = action.payload; },
    setLoading(state, action)    { state.loading = action.payload; },
    setError(state, action)      { state.error = action.payload; },
    setCategory(state, action)   { state.category = action.payload; state.selectedId = null; },
    setFilter(state, action)     { state.filter = action.payload; state.selectedId = null; },
    setSelected(state, action)   { state.selectedId = action.payload; },
  },
});

export const {
  setItems, setLoading, setError, setCategory, setFilter, setSelected,
} = fabricSlice.actions;

export const selectFabricAll       = (s) => s.fabric.items;
export const selectFabricLoading   = (s) => s.fabric.loading;
export const selectFabricError     = (s) => s.fabric.error;
export const selectFabricCategory  = (s) => s.fabric.category;
export const selectFabricFilter    = (s) => s.fabric.filter;
export const selectFabricSelectedId = (s) => s.fabric.selectedId;

export const selectFilteredFabrics = (s) => {
  const { items, filter } = s.fabric;
  if (filter === "ALL") return items;
  return items.filter((f) => f.material === filter);
};

export const selectSelectedFabric = (s) => {
  const { items, selectedId } = s.fabric;
  if (!selectedId) return items[0] || null;
  return items.find((f) => f.id === selectedId) || items[0] || null;
};

export default fabricSlice.reducer;