// Navbar.jsx
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

  const handleLogin = () => navigate("/login");
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    toggleSidebar(); // parent toggle
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
    <nav className="p-4 md:p-6 flex items-center justify-between bg-white dark:bg-gray-900  sticky top-0 z-50 transition-colors">
      {/* Left: Sidebar toggle + Title */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition transform active:scale-95"
          onClick={handleToggleSidebar}
        >
          {isSidebarOpen ? (
            <FaTimes className="w-6 h-6 text-gray-800 dark:text-white" />
          ) : (
            <FaBars className="w-6 h-6 text-gray-800 dark:text-white" />
          )}
        </button>

        {/* Only show text on md and above */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white hidden md:block">
          Student Life Toolkit
        </h1>
      </div>

      {/* Right: Theme toggle + Notifications + Avatar + Login/Logout */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={handleToggleTheme}
        >
          {isDarkMode ? (
            <FaSun className="w-5 h-5 text-yellow-400" />
          ) : (
            <FaMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <FaBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900" />
        </button>

        {/* Avatar */}
        {user && (
          <Avatar className="w-10 h-10 rounded-full border-2 border-blue-500 hover:scale-105 transition-transform">
            <span className="text-sm font-semibold text-blue-500 dark:text-blue-400">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </Avatar>
        )}

        {/* Login / Logout */}
        {user ? (
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="px-4 py-2"
          >
            Logout
          </Button>
        ) : (
          <Button variant="default" onClick={handleLogin} className="px-4 py-2">
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}
