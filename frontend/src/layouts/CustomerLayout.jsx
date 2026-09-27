import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}