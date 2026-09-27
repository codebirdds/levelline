import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
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
    return <div className="grid place-items-center min-h-screen">Loading…</div>;
  }
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Bootstrapper>
        <AppRouter />
      </Bootstrapper>
    </Provider>
  </React.StrictMode>
);