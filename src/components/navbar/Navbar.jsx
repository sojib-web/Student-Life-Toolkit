import React from "react";
import { Avatar } from "../ui/avatar";
import { FaBars, FaBell } from "react-icons/fa";

export default function Navbar({ toggleSidebar }) {
  return (
    <nav className="p-6 flex items-center justify-between dark:text-gray-100 sticky top-0 z-50 bg-white dark:bg-gray-900 shadow">
      <div className="flex items-center gap-4">
        {/* Sidebar trigger */}
        <button
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={toggleSidebar}
        >
          <FaBars className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Student Life Toolkit
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <FaBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900" />
        </button>

        <Avatar className="w-10 h-10 rounded-full border-2 border-blue-500 hover:scale-105 transition-transform">
          <span className="text-sm font-semibold text-blue-500 dark:text-blue-400">
            SA
          </span>
        </Avatar>
      </div>
    </nav>
  );
}
