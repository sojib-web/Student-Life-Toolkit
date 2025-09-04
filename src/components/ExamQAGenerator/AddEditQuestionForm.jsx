import React from "react";

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
      opts[idx] = value;
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
    <div className="p-5 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h2 className="font-semibold mb-3 text-lg">
        {editingQuestion ? "Edit Question" : "Add Custom Question"}
      </h2>
      <form onSubmit={submitHandler} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <select
            value={type}
            onChange={(e) => updateField("type", e.target.value)}
            className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="MCQ">MCQ</option>
            <option value="Short">Short</option>
            <option value="TrueFalse">TrueFalse</option>
          </select>
          <select
            value={
              editingQuestion ? editingQuestion.difficulty : newQ.difficulty
            }
            onChange={(e) => updateField("difficulty", e.target.value)}
            className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <textarea
          value={editingQuestion ? editingQuestion.question : newQ.question}
          onChange={(e) => updateField("question", e.target.value)}
          placeholder="Enter your question"
          rows={3}
          className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
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
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
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
              className="px-2 py-1 bg-[#43426E] text-white rounded hover:bg-[#2F2E58]"
            >
              Add Option
            </button>
            <input
              value={editingQuestion ? editingQuestion.answer : newQ.answer}
              onChange={(e) => updateField("answer", e.target.value)}
              placeholder="Correct Answer"
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
        )}

        {type === "TrueFalse" && (
          <select
            value={editingQuestion ? editingQuestion.answer : newQ.answer}
            onChange={(e) => updateField("answer", e.target.value)}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
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
            placeholder="Correct Answer"
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
          />
        )}

        {formError && <div className="text-red-500">{formError}</div>}

        <button
          type="submit"
          disabled={saving}
          className="w-full px-3 py-2 bg-[#43426E] text-white rounded hover:bg-[#2F2E58] disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : editingQuestion
            ? "Update Question"
            : "Add Question"}
        </button>
      </form>
    </div>
  );
}
