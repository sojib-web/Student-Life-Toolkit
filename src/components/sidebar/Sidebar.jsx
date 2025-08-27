import React from "react";
import { Link, useLocation } from "react-router";
import clsx from "clsx";
import {
  FaTachometerAlt,
  FaBook,
  FaWallet,
  FaClipboardList,
  FaCalendarAlt,
} from "react-icons/fa";

export default function Sidebar({ isCollapsed, isMobile, isOpen, setIsOpen }) {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
    { name: "Classes", path: "/classes", icon: <FaBook /> },
    { name: "Budget", path: "/budget", icon: <FaWallet /> },
    { name: "Exam Q&A", path: "/exam", icon: <FaClipboardList /> },
    { name: "Study Planner", path: "/study", icon: <FaCalendarAlt /> },
  ];

  return (
    <>
      <aside
        className={clsx(
          "bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 flex flex-col z-50",
          {
            // Desktop sidebar
            "w-64 p-6 items-start h-screen": !isCollapsed && !isMobile,
            "w-20 p-4 items-center h-screen": isCollapsed && !isMobile,
            // Mobile sidebar below navbar (navbar height = 64px -> h-16)
            "fixed top-24 left-0 w-64 p-6 h-[calc(100%-4rem)] transform transition-transform duration-300":
              isMobile,
            "translate-x-0": isMobile && isOpen,
            "-translate-x-full": isMobile && !isOpen,
          }
        )}
      >
        {/* Logo */}
        <h2
          className={clsx(
            "text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100",
            {
              hidden: isCollapsed && !isMobile, // hide logo on collapsed desktop
            }
          )}
        >
          Student Toolkit
        </h2>

        {/* Navigation Items */}
        <ul className="flex flex-col gap-3 w-full">
          {navItems.map((item) => (
            <li key={item.path} className="w-full text-center">
              <Link
                to={item.path}
                className={clsx(
                  "flex items-center gap-4 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium",
                  location.pathname === item.path &&
                    "bg-gray-200 dark:bg-gray-700",
                  isCollapsed && !isMobile && "justify-center" // center icons on desktop collapsed
                )}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                {/* Show text only on expanded desktop or on mobile */}
                {(!isCollapsed || isMobile) && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
