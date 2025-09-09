import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center px-6">
      {/* Animation Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        {/* 404 Text */}
        <h1 className="text-9xl font-extrabold text-pink-500 drop-shadow-md">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
          Oops! Page Not Found 😢
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md transition-all duration-300"
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>
      </motion.div>

      {/* Project Name */}
      <p className="mt-10 text-gray-500 dark:text-gray-400 text-sm">
        Student Life Toolkit © {new Date().getFullYear()}
      </p>
    </div>
  );
}
