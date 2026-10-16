import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { bootstrapAuthThunk } from "./features/auth/authThunks";
import { selectBootstrapped } from "./features/auth/authSlice";
import AppRouter from "./routes/AppRouter";
import "./styles/index.css";

function Bootstrapper({ children }) {
  const dispatch = useDispatch();
  const bootstrapped = useSelector(selectBootstrapped);

  useEffect(() => {
    dispatch(bootstrapAuthThunk());
  }, [dispatch]);

  if (!bootstrapped) {
    return (
      <div className="grid place-items-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          <p className="text-sm text-[#808080]">Loading…</p>
        </div>
      </div>
    );
  }
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster position="bottom-right" />
      <Bootstrapper>
        <AppRouter />
      </Bootstrapper>
    </Provider>
  </React.StrictMode>
);