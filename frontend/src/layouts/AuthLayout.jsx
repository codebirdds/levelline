import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid place-items-center bg-bg px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-[var(--shadow-card)] p-8">
        <Outlet />
      </div>
    </div>
  );
}