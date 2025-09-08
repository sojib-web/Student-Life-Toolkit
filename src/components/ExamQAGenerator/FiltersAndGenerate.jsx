import React from "react";
import CurrentQuestion from "./CurrentQuestion";
import { Button } from "@/components/ui/button"; // ✅ Using shadcn/ui buttons
import { MdFilterListAlt } from "react-icons/md";
import { FaQuestion } from "react-icons/fa";

export default function FiltersAndGenerate({
  filterType,
  setFilterType,
  filterDifficulty,
  setFilterDifficulty,
  onGenerate,
  current,
  userAnswer,
  setUserAnswer,
  feedback,
  showAnswer,
  setShowAnswer,
  onCheck,
}) {
  return (
    <div className="p-6 dark:from-gray-900 dark:to-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 space-y-6 transition-transform transform hover:scale-[1.01] duration-300">
      {/* Filters */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MdFilterListAlt className="text-gray-600 dark:text-gray-300 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Filters
          </h2>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>All</option>
            <option>MCQ</option>
            <option>Short</option>
            <option>TrueFalse</option>
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-4">
          <Button
            onClick={onGenerate}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Generate Question <FaQuestion />
          </Button>
          <Button
            onClick={() => {
              setFilterType("All");
              setFilterDifficulty("All");
            }}
            variant="outline"
            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-transform transform hover:scale-105"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Current Question */}
      <CurrentQuestion
        current={current}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        feedback={feedback}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
        onCheck={onCheck}
      />
    </div>
  );
}
