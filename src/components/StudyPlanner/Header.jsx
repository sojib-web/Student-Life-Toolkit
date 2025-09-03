import React from "react";

export default function Header({ title, subtitle }) {
  return (
    <div className="text-center mb-6 px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
