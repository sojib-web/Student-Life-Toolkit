import axiosInstance from "@/utils/axiosInstance";
import React, { useState } from "react";
import { motion } from "framer-motion";

import { TbBrandOpenai } from "react-icons/tb";
export default function AIQuestionForm() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate Questions
  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("⚠️ Please enter a topic");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post("/api/generate-questions", {
        topic: topic.trim(),
        count: 5,
        difficulty: "Easy",
        type: "MCQ",
        lang: "en",
      });
      if (res.data?.questions) setQuestions(res.data.questions);
      else throw new Error("Invalid response format");
      setSelectedAnswers({});
      setSubmitted(false);
    } catch (err) {
      console.error(err);
      setError("Failed to generate questions. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (qIndex, oIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: oIndex });
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      for (let i = 0; i < questions.length; i++) {
        await axiosInstance.post("/questions", {
          type: "MCQ",
          difficulty: questions[i].difficulty || "Easy",
          question: questions[i].question,
          options: questions[i].options,
          answer: questions[i].options[questions[i].correctAnswer],
          explanation: questions[i].explanation,
        });
      }
      console.log("✅ All answers uploaded");
    } catch (err) {
      console.error("❌ Failed to upload answers:", err);
    }
  };

  const calculateScore = () =>
    questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length;

  const resetQuiz = () => {
    setQuestions([]);
    setSelectedAnswers({});
    setSubmitted(false);
    setError(null);
  };

  return (
    <div className="relative mt-6 sm:mt-10 w-full flex flex-col lg:flex-row gap-6 lg:gap-10 items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
      {/* Background Floating Blobs */}
      <div className="absolute -top-20 -left-20 w-56 h-56 sm:w-72 sm:h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-0 w-56 h-56 sm:w-72 sm:h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Left Section */}
      <div className="flex-1 flex flex-col gap-4 sm:gap-5 z-10 w-full">
        <h2 className="flex items-center gap-2 text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
          <TbBrandOpenai
            size={36}
            className="text-pink-500 dark:text-pink-400"
          />
          AI Question Generator
        </h2>

        <p className="text-gray-300 text-sm sm:text-base">
          Enter a topic and generate AI-powered multiple-choice questions with
          explanations.
        </p>

        {/* Input & Generate Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <input
            type="text"
            placeholder="e.g. JavaScript, Physics, Algorithms..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 px-4 py-3 sm:py-3.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500 bg-opacity-20 text-red-400 rounded-lg border border-red-400 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Questions Section */}
        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-5 sm:mt-6 space-y-4 sm:space-y-6 w-full"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h3 className="text-lg sm:text-xl font-semibold text-pink-400 mb-2 sm:mb-0">
                Questions about "{topic}"
              </h3>
              <button
                onClick={resetQuiz}
                className="text-sm sm:text-base text-blue-400 hover:text-blue-500 mt-2 sm:mt-0"
              >
                🔄 New Topic
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <motion.div
                key={qIndex}
                whileHover={{ scale: 1.02 }}
                className="p-4 sm:p-5 rounded-2xl bg-gray-800 border border-gray-700 shadow-lg w-full"
              >
                <h4 className="text-base sm:text-lg font-medium text-purple-300 mb-2 sm:mb-3">
                  {qIndex + 1}. {q.question}
                </h4>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
                  {q.options.map((option, oIndex) => (
                    <label
                      key={oIndex}
                      className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        checked={selectedAnswers[qIndex] === oIndex}
                        onChange={() => handleAnswerSelect(qIndex, oIndex)}
                        className="w-4 sm:w-5 h-4 sm:h-5 text-purple-500 focus:ring-purple-400 border-gray-600"
                        disabled={submitted}
                      />
                      <span className="text-gray-200 text-sm sm:text-base">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>

                {submitted && (
                  <div
                    className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl text-sm sm:text-base ${
                      selectedAnswers[qIndex] === q.correctAnswer
                        ? "bg-green-600 bg-opacity-20 border border-green-500 text-green-300"
                        : "bg-red-600 bg-opacity-20 border border-red-500 text-red-300"
                    }`}
                  >
                    <p>
                      ✅ <strong>Correct Answer:</strong>{" "}
                      {q.options[q.correctAnswer]}
                    </p>
                    <p className="mt-1 text-gray-300">
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}

            {!submitted && (
              <button
                onClick={handleSubmit}
                className="w-full py-3 sm:py-3.5 mt-3 sm:mt-4 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white font-semibold shadow-md transition-transform transform hover:scale-105"
              >
                Submit Answers
              </button>
            )}

            {submitted && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 sm:p-5 bg-blue-600 bg-opacity-20 border border-blue-500 text-blue-300 rounded-xl shadow-md mt-4 sm:mt-5"
              >
                <h4 className="text-base sm:text-lg font-bold">
                  Your Score: {calculateScore()} / {questions.length}
                </h4>
                <p className="text-sm sm:text-base">
                  You got {calculateScore()} out of {questions.length} correct
                  🎉
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
