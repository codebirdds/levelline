import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { injectStore } from "../api/axiosInstance";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
  devTools: import.meta.env.MODE !== "production",
});

// Give axios access to store (for logout-on-refresh-failure)
injectStore(store);

export default store;