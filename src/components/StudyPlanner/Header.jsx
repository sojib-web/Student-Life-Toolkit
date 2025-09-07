import React from "react";
import { AiFillFire } from "react-icons/ai";

export default function Header({ title, subtitle, showIcon = true }) {
  return (
    <div className="text-center mb-6 px-4 sm:px-6 md:px-8 flex flex-col items-center gap-3">
      {/* Icon + Title */}
      <div className="flex items-center gap-3">
        {showIcon && <AiFillFire size={40} className="" />}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold 
                     bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 
                     text-transparent bg-clip-text leading-tight"
        >
          {title}
        </h1>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
