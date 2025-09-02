import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ExamQAGenerator() {
  const sampleQuestions = [
    {
      id: "s1",
      type: "MCQ",
      difficulty: "Easy",
      question: "React কোন ভাষায় তৈরি?",
      options: ["Python", "JavaScript", "PHP", "C++"],
      answer: "JavaScript",
    },
    {
      id: "s2",
      type: "TrueFalse",
      difficulty: "Easy",
      question: "HTML একটি প্রোগ্রামিং ভাষা।",
      answer: "False",
    },
    {
      id: "s3",
      type: "Short",
      difficulty: "Medium",
      question: "State এবং Props মধ্যে মূলত পার্থক্য কি?",
      answer:
        "State কম্পোনেন্ট-লোকাল ডেটা, props প্যারেন্ট থেকে পাস করা ইনপুট।",
    },
  ];

  const [customQuestions, setCustomQuestions] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [current, setCurrent] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newQ, setNewQ] = useState({
    type: "MCQ",
    difficulty: "Easy",
    question: "",
    options: ["", ""],
    answer: "",
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const QUESTIONS_PER_PAGE = 3;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axiosInstance.get("/questions");
        setCustomQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load questions.");
      }
    };
    fetchQuestions();
  }, []);

  const combinedBank = [...sampleQuestions, ...customQuestions];

  const filteredBank = () =>
    combinedBank.filter(
      (q) =>
        (filterType === "All" || q.type === filterType) &&
        (filterDifficulty === "All" || q.difficulty === filterDifficulty)
    );

  const pickRandomQuestion = () => {
    const pool = filteredBank();
    if (!pool.length) {
      setCurrent(null);
      setFeedback(null);
      setShowAnswer(false);
      return;
    }
    const idx = Math.floor(Math.random() * pool.length);
    const q = pool[idx];
    if (q.type === "MCQ") {
      const shuffled = [...(q.options || [])].sort(() => Math.random() - 0.5);
      setCurrent({ ...q, options: shuffled });
    } else setCurrent(q);
    setUserAnswer("");
    setFeedback(null);
    setShowAnswer(false);
  };

  const checkAnswer = () => {
    if (!current) return;
    let correct = false;
    if (current.type === "MCQ" || current.type === "TrueFalse") {
      correct = userAnswer === current.answer;
    } else if (current.type === "Short") {
      correct =
        (userAnswer || "").trim().toLowerCase() ===
        (current.answer || "").trim().toLowerCase();
    }
    setFeedback(correct ? "Correct!" : "Incorrect");
    setShowAnswer(true);
    toast[correct ? "success" : "error"](correct ? "Correct!" : "Incorrect!");
  };

  const updateNewQ = (field, value, idx = null) => {
    if (field === "option") {
      const opts = [...newQ.options];
      opts[idx] = value;
      setNewQ({ ...newQ, options: opts });
    } else {
      setNewQ({ ...newQ, [field]: value });
    }
  };

  const validateNewQuestion = (payload) => {
    if (!payload.question.trim()) return "Question is required.";
    if (!payload.answer.trim()) return "Answer is required.";
    if (payload.type === "MCQ") {
      const opts = (payload.options || []).map((o) => o.trim()).filter(Boolean);
      if (opts.length < 2) return "MCQ needs at least 2 options.";
      if (!opts.includes(payload.answer.trim()))
        return "Answer must match one of the options.";
    }
    if (
      payload.type === "TrueFalse" &&
      !["True", "False"].includes(payload.answer.trim())
    )
      return "Answer must be True or False.";
    return null;
  };

  const submitNewQuestion = async (e) => {
    e.preventDefault();
    setFormError("");
    const payload = {
      type: newQ.type,
      difficulty: newQ.difficulty,
      question: newQ.question.trim(),
      options:
        newQ.type === "MCQ" ? newQ.options.map((o) => o.trim()) : undefined,
      answer: newQ.answer.trim(),
    };
    const error = validateNewQuestion(payload);
    if (error) return setFormError(error);
    try {
      setSaving(true);
      const { data } = await axiosInstance.post("/questions", payload);
      setCustomQuestions((prev) => [data, ...prev]);
      setNewQ({
        type: "MCQ",
        difficulty: "Easy",
        question: "",
        options: ["", ""],
        answer: "",
      });
      toast.success("Question added successfully!");
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || "Failed to save question.");
      toast.error("Failed to save question.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id) => {
    toast.info(
      <div className="space-x-2">
        <span>Are you sure you want to delete this question?</span>
        <button
          onClick={async () => {
            try {
              await axiosInstance.delete(`/questions/${id}`);
              setCustomQuestions((prev) => prev.filter((q) => q._id !== id));
              toast.dismiss();
              toast.success("Question deleted!");
            } catch {
              toast.dismiss();
              toast.error("Failed to delete question.");
            }
          }}
          className="px-2 py-1 bg-[#43426E] text-white rounded hover:bg-[#2F2E58]"
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss()}
          className="px-2 py-1 bg-gray-300 dark:bg-gray-600 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          No
        </button>
      </div>,
      { autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  const totalPages = Math.ceil(customQuestions.length / QUESTIONS_PER_PAGE);
  const paginatedQuestions = customQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  return (
    <div className="min-h-screen p-6  dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">
        Exam Q&A Generator
      </h1>

      {/* Top Row: Filters + Add Question */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="p-5 bg-white dark:bg-gray-800 shadow rounded-lg">
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
              onClick={pickRandomQuestion}
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
          {/* Current Question */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded">
            {current ? (
              <div className="space-y-4">
                <div className="text-lg font-medium">{current.question}</div>
                {current.type === "MCQ" &&
                  (current.options || []).map((opt, i) => (
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
                        name={`mcq-${current._id || current.id}`}
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
                  <button
                    onClick={checkAnswer}
                    className="px-3 py-2 bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 dark:hover:bg-green-400"
                  >
                    Check
                  </button>
                  <button
                    onClick={() => setShowAnswer((s) => !s)}
                    className="px-3 py-2 bg-yellow-400 dark:bg-yellow-500 rounded hover:bg-yellow-500 dark:hover:bg-yellow-400"
                  >
                    {showAnswer ? "Hide" : "Show"} Answer
                  </button>
                </div>
                {feedback && <div className="text-sm">{feedback}</div>}
                {showAnswer && (
                  <div className="p-2 border rounded bg-gray-50 dark:bg-gray-600">
                    <strong>Answer:</strong> {current.answer}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-sm text-center">
                Click "Generate Question" to start.
              </div>
            )}
          </div>
        </div>

        {/* Add Custom Question */}
        <div className="p-5 bg-white dark:bg-gray-800 shadow rounded-lg">
          <h2 className="font-semibold mb-3 text-lg">Add Custom Question</h2>
          <form onSubmit={submitNewQuestion} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newQ.type}
                onChange={(e) =>
                  setNewQ({ ...newQ, type: e.target.value, answer: "" })
                }
                className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="MCQ">MCQ</option>
                <option value="Short">Short</option>
                <option value="TrueFalse">TrueFalse</option>
              </select>
              <select
                value={newQ.difficulty}
                onChange={(e) =>
                  setNewQ({ ...newQ, difficulty: e.target.value })
                }
                className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <textarea
              value={newQ.question}
              onChange={(e) => setNewQ({ ...newQ, question: e.target.value })}
              placeholder="Enter your question"
              rows={3}
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
            />
            {newQ.type === "MCQ" && (
              <div className="space-y-2">
                {newQ.options.map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    onChange={(e) => updateNewQ("option", e.target.value, i)}
                    placeholder={`Option ${i + 1}`}
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                  />
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setNewQ({ ...newQ, options: [...newQ.options, ""] })
                  }
                  className="px-2 py-1 bg-[#43426E] text-white rounded hover:bg-[#2F2E58]"
                >
                  Add Option
                </button>
                <input
                  value={newQ.answer}
                  onChange={(e) => setNewQ({ ...newQ, answer: e.target.value })}
                  placeholder="Correct Answer"
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            )}
            {newQ.type === "TrueFalse" && (
              <select
                value={newQ.answer}
                onChange={(e) => setNewQ({ ...newQ, answer: e.target.value })}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="">Select Answer</option>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            )}
            {newQ.type === "Short" && (
              <input
                value={newQ.answer}
                onChange={(e) => setNewQ({ ...newQ, answer: e.target.value })}
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
              {saving ? "Saving..." : "Add Question"}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Row: Custom Questions Full Width */}
      <div className="p-5 bg-white dark:bg-gray-800 shadow rounded-lg w-full max-w-full max-h-[400px] overflow-auto">
        <h2 className="font-semibold mb-3 text-lg">Your Questions</h2>
        {customQuestions.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            No custom questions yet.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {paginatedQuestions.map((q) => (
                <div
                  key={q._id}
                  className="p-2 border rounded flex justify-between bg-gray-50 dark:bg-gray-700"
                >
                  <div>
                    <div className="font-medium">{q.question}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      {q.type} • {q.difficulty}
                    </div>
                  </div>
                  <button
                    onClick={() => confirmDelete(q._id)}
                    className="px-2 py-1 bg-[#43426E] text-white dark:text-white rounded "
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === idx + 1 ? "bg-[#43426E] text-white" : ""
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme={
          document.documentElement.classList.contains("dark") ? "dark" : "light"
        }
      />
    </div>
  );
}
