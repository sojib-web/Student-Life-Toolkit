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
        Click "Generate Question" to start.
      </div>
    );

  // Show Answer button disabled until user clicks Check
  const showAnswerDisabled = !feedback;

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded space-y-4">
      <div className="text-lg font-medium">{current.question}</div>

      {current.type === "MCQ" &&
        current.options?.map((opt, i) => (
          <label
            key={i}
            className={`block p-2 border rounded cursor-pointer ${
              userAnswer === opt
                ? "bg-[#43426E] text-white border-[#43426E]"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <input
              type="radio"
              value={opt}
              checked={userAnswer === opt}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="mr-2"
            />
            {opt}
          </label>
        ))}

      {current.type === "TrueFalse" &&
        ["True", "False"].map((t) => (
          <button
            key={t}
            onClick={() => setUserAnswer(t)}
            className={`px-3 py-2 mr-2 mb-2 border rounded ${
              userAnswer === t
                ? "bg-[#43426E] text-white border-[#43426E]"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {t}
          </button>
        ))}

      {current.type === "Short" && (
        <input
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Write your answer"
          className="w-full p-2 border rounded bg-white dark:bg-gray-600"
        />
      )}

      <div className="flex gap-2 mt-2">
        {/* Check button */}
        <button
          onClick={onCheck}
          className="px-3 py-2 bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 dark:hover:bg-green-400"
        >
          Check
        </button>

        {/* Show Answer button */}
        <button
          onClick={() => setShowAnswer((s) => !s)}
          disabled={showAnswerDisabled}
          className={`px-3 py-2 rounded ${
            showAnswerDisabled
              ? "bg-yellow-200 dark:bg-yellow-400 text-gray-400 cursor-not-allowed"
              : "bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-400"
          }`}
        >
          {showAnswer ? "Hide" : "Show"} Answer
        </button>
      </div>

      {/* Feedback shows immediately after Check */}
      {feedback && <div className="text-sm">{feedback}</div>}

      {/* Answer only shows when user clicks Show Answer */}
      {showAnswer && (
        <div className="p-2 border rounded bg-gray-50 dark:bg-gray-600">
          <strong>Answer:</strong> {current.answer}
        </div>
      )}
    </div>
  );
}
