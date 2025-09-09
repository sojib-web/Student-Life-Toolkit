import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import { FiSun, FiMail, FiBell, FiCalendar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Sidebar toggle - all devices */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <FaBars className="text-gray-600 dark:text-gray-300 text-lg" />
        </button>

        {/* Search bar */}
        <div className="relative w-32 sm:w-48 md:w-72 hidden sm:block">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FiSun className="text-gray-600 dark:text-gray-300 text-xl" />
        </button>

        {/* Profile Dropdown */}
        <div ref={dropdownRef} className="relative">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded-lg transition"
          >
            <img
              src={user?.photoURL || "https://i.ibb.co/tM2sB8ch/image.png"}
              alt="Profile"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            />

            {/* Name & email responsive */}

            <div className="flex flex-col items-start min-w-0">
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate w-[100px] sm:w-[150px] md:w-[200px]">
                {user?.displayName || "Guest User"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate w-[100px] sm:w-[150px] md:w-[200px]">
                {user?.email || "guest@example.com"}
              </span>
            </div>

            <span className="w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
          </div>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={() => setIsDropdownOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={() => setIsDropdownOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
