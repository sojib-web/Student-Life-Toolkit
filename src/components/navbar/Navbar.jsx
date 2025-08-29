import React, { useState, useEffect } from "react";
import { Avatar } from "../ui/avatar";
import { FaBars, FaTimes, FaBell, FaMoon, FaSun } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLogin = () => navigate("/login");
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    toggleSidebar();
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <nav className="p-4 md:p-6 flex items-center justify-between bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-md transition-colors">
      {/* Left: Sidebar toggle + Title */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition transform active:scale-95"
          onClick={handleToggleSidebar}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white hidden md:block">
          Student Life Toolkit
        </h1>
      </div>

      {/* Right: Theme toggle + Notifications + Avatar + Login/Logout */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={handleToggleTheme}
        >
          {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
        </button>

        <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <FaBell />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900" />
        </button>

        {user && (
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Avatar className="w-10 h-10 rounded-full border-2 border-blue-500 hover:scale-105 transition-transform cursor-pointer">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-sm font-semibold text-blue-500 dark:text-blue-400">
                  {user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </span>
              )}
            </Avatar>

            {/* Tooltip with full name */}
            {showTooltip && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm rounded-md px-2 py-1 shadow-lg whitespace-nowrap z-50">
                {user.displayName || user.email}
              </div>
            )}
          </div>
        )}

        {user ? (
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button variant="default" onClick={handleLogin}>
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}
