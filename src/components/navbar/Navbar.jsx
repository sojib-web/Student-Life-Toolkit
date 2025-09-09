import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "../ui/avatar";
import {
  FaBars,
  FaTimes,
  FaBell,
  FaMoon,
  FaSun,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaGlobe,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  // Dummy notifications
  useEffect(() => {
    setNotifications([
      { id: 1, text: "New class added!", unread: true },
      { id: 2, text: "Exam schedule updated", unread: true },
      { id: 3, text: "Budget reminder for this week", unread: false },
    ]);
  }, []);

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

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Save theme preference
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

      {/* Middle: Search Bar */}
      <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg w-1/3">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search classes, exams, budgets..."
          className="bg-transparent outline-none w-full text-gray-800 dark:text-gray-100"
        />
      </div>

      {/* Right: Buttons & Avatar */}
      <div className="flex items-center gap-4 relative">
        {/* Theme Toggle */}
        <button
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={handleToggleTheme}
        >
          {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            {notifications.filter((n) => n.unread).length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
                {notifications.filter((n) => n.unread).length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50"
              >
                <div className="p-2">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          n.unread ? "font-semibold" : "text-gray-400"
                        }`}
                      >
                        {n.text}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 p-2 text-center">
                      No notifications
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar */}
        {user && (
          <div className="relative">
            <div
              className="relative"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
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
              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm rounded-md px-2 py-1 shadow-lg whitespace-nowrap z-50">
                  {user.displayName || user.email}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50"
                >
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaUser /> Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaCog /> Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-100 dark:hover:bg-red-700 text-red-600"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Login Button */}
        {!user && (
          <Button variant="default" onClick={handleLogin}>
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}
