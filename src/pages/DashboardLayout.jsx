import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop collapse
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mobile overlay

  // Detect mobile devices
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile); // Desktop open, Mobile closed initially
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen); // Mobile overlay
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed); // Desktop collapse
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main content */}
      <div
        className="flex flex-col flex-1 min-h-screen transition-all duration-300"
        style={{
          marginLeft: isMobile ? "0" : isSidebarCollapsed ? "80px" : "256px", // Desktop width
        }}
      >
        <Navbar sidebarOpen={isSidebarOpen} setSidebarOpen={toggleSidebar} />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
