import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/layout/AdminSidebar";
import AdminHeader from "../components/layout/AdminHeader";

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-bg relative">
      
      {/* Mobile Overlay (Dark background) - Clicking this closes the sidebar */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar component with mobile toggle props */}
      <AdminSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* 
          Passing onMenuClick to AdminHeader.
          NOTE: You will need to add an `onMenuClick` prop and a hamburger icon inside your AdminHeader.jsx to trigger this.
        */}
        <AdminHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 p-6 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}