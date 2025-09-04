import React from "react";

export default function CustomQuestionsList({
  questions,
  currentPage,
  setCurrentPage,
  deleteQuestion,
  setEditingQuestion,
  QUESTIONS_PER_PAGE = 5,
}) {
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  const startIdx = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(
    startIdx,
    startIdx + QUESTIONS_PER_PAGE
  );

  return (
    <div className="p-5 bg-white dark:bg-gray-800 shadow rounded-lg mt-6">
      <h2 className="font-semibold mb-3 text-lg">Custom Questions</h2>
      {currentQuestions.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          No questions found.
        </div>
      ) : (
        <ul className="space-y-3">
          {currentQuestions.map((q) => (
            <li
              key={q._id || q.id}
              className="p-3 border rounded flex justify-between items-center bg-gray-50 dark:bg-gray-700"
            >
              <div>
                <div className="font-medium">{q.question}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  Type: {q.type}, Difficulty: {q.difficulty}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingQuestion(q)}
                  disabled={!q._id} // Sample question edit বন্ধ
                  className={`px-2 py-1 rounded ${
                    q._id
                      ? "bg-yellow-400 hover:bg-yellow-500"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white`}
                >
                  Edit
                </button>

                <button
                  onClick={() => q._id && deleteQuestion(q._id)}
                  disabled={!q._id}
                  className={`px-2 py-1 rounded ${
                    q._id
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-[#43426E] text-white"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
