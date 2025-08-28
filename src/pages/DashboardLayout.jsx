// DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import Dashboard from "@/pages/Dashboard";

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile); // Desktop open, Mobile closed initially
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const desktopSidebarWidth = isSidebarCollapsed ? "80px" : "256px";

  return (
    <div className="flex min-h-screen dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: !isMobile ? desktopSidebarWidth : 0 }}
      >
        <Navbar
          toggleSidebar={() =>
            isMobile
              ? setIsSidebarOpen(!isSidebarOpen)
              : setIsSidebarCollapsed(!isSidebarCollapsed)
          }
        />
        <main className="p-6 flex-1 overflow-auto transition-all duration-300">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}
