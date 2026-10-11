import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function CustomerLayout({ scrolled = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header scroll={scrolled} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}