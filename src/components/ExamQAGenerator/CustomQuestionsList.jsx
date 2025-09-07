import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { BiCustomize } from "react-icons/bi";

export default function CustomQuestionsList({
  questions,
  deleteQuestion,
  setEditingQuestion,
  itemsPerPage = 3,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Utility function to highlight matching text
  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          className="bg-yellow-200 dark:bg-yellow-500 font-semibold"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Filter questions based on searchQuery
  const filteredQuestions = questions.filter(
    (q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.difficulty &&
        q.difficulty.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-4 sm:p-6 md:p-8 mt-6 md:mt-10 dark:bg-gray-900 shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-5 sm:mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2 sm:gap-3">
        <BiCustomize className="text-gray-600 dark:text-gray-300" /> Custom
        Questions
      </h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search questions, type or difficulty..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1); // reset page when search changes
        }}
        className="w-full mb-4 p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-gray-800 placeholder-gray-400"
      />

      {filteredQuestions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center text-base sm:text-lg">
          No questions found.
        </p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {currentQuestions.map((q, idx) => (
            <div
              key={q._id || `custom-${idx}`}
              className="p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between md:items-center gap-3 sm:gap-4"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-base sm:text-lg md:text-xl">
                  {highlightText(q.question, searchQuery)}
                </p>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-300 mt-1 sm:mt-2">
                  {highlightText(q.type, searchQuery)} | Difficulty:{" "}
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    {highlightText(q.difficulty, searchQuery)}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 sm:gap-3 justify-end mt-2 md:mt-0">
                <Button
                  onClick={() => setEditingQuestion(q)}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 dark:bg-gray-700 text-white rounded-lg flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                  <FaEdit /> Edit
                </Button>
                <Button
                  onClick={() => deleteQuestion(q._id)}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 bg-red-600 dark:bg-red-700 text-white rounded-lg flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                  <FaTrashAlt /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredQuestions.length > itemsPerPage && (
        <div className="flex flex-wrap justify-center items-center mt-6 sm:mt-8 gap-2 sm:gap-6">
          <Button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 sm:px-5 py-2 bg-gray-700 dark:bg-gray-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            <GrFormPreviousLink className="text-lg sm:text-xl" /> Prev
          </Button>
          <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 sm:px-5 py-2 bg-gray-700 dark:bg-gray-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            Next <GrFormNextLink className="text-lg sm:text-xl" />
          </Button>
        </div>
      )}
    </div>
  );
}
