import { motion } from "framer-motion";
import { useState } from "react";

export default function ProgressBar({
  completion,
  totalTasks,
  completedTasks,
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div
      className="relative w-full max-w-[140px]"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-lg z-10 whitespace-nowrap">
          <div>Total: {totalTasks}</div>
          <div>Completed: {completedTasks}</div>
          <div>Remaining: {Math.max(totalTasks - completedTasks, 0)}</div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-gray-900" />
        </div>
      )}
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${completion}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ willChange: "width" }}
        />
      </div>
      <div className="mt-1 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">
        {completion}%
      </div>
    </div>
  );
}
