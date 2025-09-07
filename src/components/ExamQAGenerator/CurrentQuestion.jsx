import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineHideSource } from "react-icons/md";
import { BiSolidShow } from "react-icons/bi";

export default function CurrentQuestion({
  current,
  userAnswer,
  setUserAnswer,
  feedback,
  showAnswer,
  setShowAnswer,
  onCheck,
}) {
  if (!current)
    return (
      <div className="text-gray-500 dark:text-gray-400 text-sm text-center">
        Click <strong>"Generate Question"</strong> to start.
      </div>
    );

  // Disable Show Answer button until user clicks Check
  const showAnswerDisabled = !feedback;

  return (
    <div className="mt-6 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 space-y-5 transition-all duration-300">
      {/* Question */}
      <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        {current.question}
      </div>

      {/* MCQ Options */}
      {current.type === "MCQ" &&
        current.options?.map((opt, i) => (
          <label
            key={i}
            className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
              userAnswer === opt
                ? "bg-gray-900 text-white border-gray-900 shadow-md"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <input
              type="radio"
              value={opt}
              checked={userAnswer === opt}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="mr-2 accent-gray-900 dark:accent-gray-300"
            />
            {opt}
          </label>
        ))}

      {/* True / False Buttons */}
      {current.type === "TrueFalse" &&
        ["True", "False"].map((t) => (
          <button
            key={t}
            onClick={() => setUserAnswer(t)}
            className={`px-4 py-2 mr-3 mb-2 rounded-lg border font-medium transition-all duration-200 ${
              userAnswer === t
                ? "bg-gray-900 text-white border-gray-900 shadow-md"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200"
            }`}
          >
            {t}
          </button>
        ))}

      {/* Short Answer Input */}
      {current.type === "Short" && (
        <input
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="✍️ Write your answer here..."
          className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all duration-200"
        />
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-3">
        {/* Check Button */}
        <button
          onClick={onCheck}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg shadow-md hover:bg-gray-800 transition-transform transform hover:scale-105"
        >
          <FaCheckCircle /> Check
        </button>

        {/* Show / Hide Answer Button */}
        <button
          onClick={() => setShowAnswer((s) => !s)}
          disabled={showAnswerDisabled}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg shadow-md transition-transform transform ${
            showAnswerDisabled
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
              : "bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-400 text-gray-900 font-semibold hover:scale-105"
          }`}
        >
          {showAnswer ? (
            <>
              <MdOutlineHideSource /> Hide Answer
            </>
          ) : (
            <>
              <BiSolidShow /> Show Answer
            </>
          )}
        </button>
      </div>

      {/* Feedback Section */}
      {feedback && (
        <div
          className={`text-sm font-medium p-3 rounded-lg shadow-sm ${
            feedback.includes("Correct")
              ? "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900"
              : "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900"
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Correct Answer Section */}
      {showAnswer && (
        <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-md">
          <strong>✅ Correct Answer:</strong> {current.answer}
        </div>
      )}
    </div>
  );
}
