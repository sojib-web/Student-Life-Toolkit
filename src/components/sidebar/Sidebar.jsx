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
import logo from "../../assets/logo.png";

export default function Sidebar({ isCollapsed, isMobile, isOpen, setIsOpen }) {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
    { name: "Class Schedule", path: "/classes", icon: <FaBook /> },
    { name: "Budget Tracker", path: "/budget", icon: <FaWallet /> },
    { name: "Exam Q&A", path: "/exam", icon: <FaClipboardList /> },
    { name: "Study Planner", path: "/study", icon: <FaCalendarAlt /> },
    { name: "Student Profile", path: "/profile", icon: <FaCalendarAlt /> },
  ];

  return (
    <>
      <aside
        className={clsx(
          "bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 flex flex-col z-50 fixed overflow-y-auto",
          {
            // Desktop sidebar
            "w-64 p-6 items-start top-0 left-0 h-screen":
              !isMobile && !isCollapsed,
            "w-20 p-4 items-center top-0 left-0 h-screen":
              !isMobile && isCollapsed,

            // Mobile sidebar
            "w-64 p-6 left-0 h-[calc(100%-4rem)] top-16": isMobile,
            "translate-y-0": isMobile && isOpen,
            "-translate-y-full": isMobile && !isOpen,
          }
        )}
      >
        {/* Logo */}
        <div
          className={clsx("flex justify-center items-center mb-6", {
            hidden: isCollapsed && !isMobile,
          })}
        >
          <img src={logo} alt="Logo" className="w-20 h-20" />
        </div>

        {/* Navigation Items */}
        <ul className="flex flex-col gap-3 w-full">
          {navItems.map((item) => (
            <li key={item.path} className="w-full text-center">
              <Link
                to={item.path}
                className={clsx(
                  "flex items-center gap-4 rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium",
                  location.pathname === item.path &&
                    "bg-gray-200 dark:bg-gray-700",
                  isCollapsed && !isMobile && "justify-center"
                )}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
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
