import React from "react";
import CurrentQuestion from "./CurrentQuestion";

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
    <div className="p-5 bg-white dark:bg-gray-800 shadow rounded-lg space-y-6">
      {/* Filters */}
      <div>
        <h2 className="font-semibold mb-3 text-lg">Filters</h2>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
          >
            <option>All</option>
            <option>MCQ</option>
            <option>Short</option>
            <option>TrueFalse</option>
          </select>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
          >
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={onGenerate}
            className="flex-1 bg-[#43426E] text-white px-3 py-2 rounded hover:bg-[#2F2E58]"
          >
            Generate Question
          </button>
          <button
            onClick={() => {
              setFilterType("All");
              setFilterDifficulty("All");
            }}
            className="flex-1 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Nested CurrentQuestion */}
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
