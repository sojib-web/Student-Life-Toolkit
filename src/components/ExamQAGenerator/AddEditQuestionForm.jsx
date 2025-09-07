import React from "react";
import { MdAddHome } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { HiSaveAs } from "react-icons/hi";
import { GrUpdate } from "react-icons/gr";

export default function AddEditQuestionForm({
  newQ,
  setNewQ,
  editingQuestion,
  setEditingQuestion,
  submitHandler,
  formError,
  saving,
}) {
  const updateField = (field, value, idx = null) => {
    if (field === "option") {
      const opts = editingQuestion
        ? [...editingQuestion.options]
        : [...newQ.options];

      if (idx === opts.length) {
        // Adding a new option
        opts.push(value);
      } else {
        opts[idx] = value;
      }

      editingQuestion
        ? setEditingQuestion({ ...editingQuestion, options: opts })
        : setNewQ({ ...newQ, options: opts });
    } else {
      editingQuestion
        ? setEditingQuestion({ ...editingQuestion, [field]: value })
        : setNewQ({ ...newQ, [field]: value });
    }
  };

  const type = editingQuestion ? editingQuestion.type : newQ.type;

  return (
    <div className="p-6 transition-transform transform hover:scale-[1.02] duration-300 dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
      <h2 className="font-bold mb-4 text-lg text-gray-800 dark:text-gray-100 flex items-center gap-2">
        {editingQuestion ? (
          <>
            <FaEdit /> Edit Question
          </>
        ) : (
          <>
            <MdAddHome /> Add Custom Question
          </>
        )}
      </h2>

      <form onSubmit={submitHandler} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <select
            value={type}
            onChange={(e) => updateField("type", e.target.value)}
            className="p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
          >
            <option value="MCQ">MCQ</option>
            <option value="Short">Short</option>
            <option value="TrueFalse">True/False</option>
          </select>

          <select
            value={
              editingQuestion ? editingQuestion.difficulty : newQ.difficulty
            }
            onChange={(e) => updateField("difficulty", e.target.value)}
            className="p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <textarea
          value={editingQuestion ? editingQuestion.question : newQ.question}
          onChange={(e) => updateField("question", e.target.value)}
          placeholder="✍️ Enter your question..."
          rows={3}
          className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
        />

        {type === "MCQ" && (
          <div className="space-y-2">
            {(editingQuestion ? editingQuestion.options : newQ.options).map(
              (opt, i) => (
                <input
                  key={i}
                  value={opt}
                  onChange={(e) => updateField("option", e.target.value, i)}
                  placeholder={`Option ${i + 1}`}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
              )
            )}

            <button
              type="button"
              onClick={() =>
                updateField(
                  "option",
                  "",
                  editingQuestion
                    ? editingQuestion.options.length
                    : newQ.options.length
                )
              }
              className="px-4 py-2 bg-gray-900 text-white rounded-lg shadow-md hover:bg-gray-800 transition flex items-center gap-2"
            >
              <MdAddHome /> Add Option
            </button>

            <input
              value={editingQuestion ? editingQuestion.answer : newQ.answer}
              onChange={(e) => updateField("answer", e.target.value)}
              placeholder="✅ Correct Answer"
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            />
          </div>
        )}

        {type === "TrueFalse" && (
          <select
            value={editingQuestion ? editingQuestion.answer : newQ.answer}
            onChange={(e) => updateField("answer", e.target.value)}
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
          >
            <option value="">Select Answer</option>
            <option value="True">True</option>
            <option value="False">False</option>
          </select>
        )}

        {type === "Short" && (
          <input
            value={editingQuestion ? editingQuestion.answer : newQ.answer}
            onChange={(e) => updateField("answer", e.target.value)}
            placeholder="✅ Correct Answer"
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
          />
        )}

        {formError && (
          <div className="text-red-500 font-medium text-sm">{formError}</div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg shadow-md hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <HiSaveAs /> Saving...
            </>
          ) : editingQuestion ? (
            <>
              <GrUpdate /> Update Question
            </>
          ) : (
            <>
              <MdAddHome /> Add Question
            </>
          )}
        </button>
      </form>
    </div>
  );
}
