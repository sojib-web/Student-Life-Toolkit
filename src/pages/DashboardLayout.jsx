import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";
import Dashboard from "@/pages/Dashboard";

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // closed initially on mobile

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true); // desktop always open
      if (mobile) setIsSidebarOpen(false); // mobile closed initially
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute sidebar width for desktop
  const desktopSidebarWidth = isSidebarCollapsed ? "" : "";

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main content */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{
          marginLeft: !isMobile ? desktopSidebarWidth : 0, // shift content for desktop
        }}
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
