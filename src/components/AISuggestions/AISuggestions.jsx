import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import axiosInstance from "@/utils/axiosInstance";
import { AiFillDropboxCircle } from "react-icons/ai";

export default function AISuggestions() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState([]);
  const [error, setError] = useState("");

  // Detect language
  const detectLanguage = (text) => (/[\u0980-\u09FF]/.test(text) ? "bn" : "en");

  const fetchTips = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setTips([]);

    try {
      const lang = detectLanguage(topic); // "bn" or "en"

      const res = await axiosInstance.post("/api/generate-questions", {
        topic: topic,
        count: 5,
        lang: lang,
      });

      const generatedTips = res.data.questions?.map((q) => q.question) || [];
      setTips(
        generatedTips.length
          ? generatedTips
          : [lang === "bn" ? "কোনও পরামর্শ নেই।" : "No suggestions available."]
      );
    } catch (e) {
      console.error("AI fetch error:", e.response || e.message);
      const lang = detectLanguage(topic);
      setError(
        e.response?.data?.message ||
          (lang === "bn"
            ? "AI পরামর্শ লোড করতে ব্যর্থ। বিকল্প দেখানো হচ্ছে।"
            : "Failed to load AI suggestions. Showing fallback.")
      );
      setTips([
        lang === "bn" ? "প্রতিদিন নোটস রিভিউ করো।" : "Review your notes daily.",
        lang === "bn"
          ? "পূর্ববর্তী প্রশ্নের প্র্যাকটিস করো।"
          : "Practice past questions.",
        lang === "bn"
          ? "দুর্বল টপিকগুলিতে প্রথমে ফোকাস করো।"
          : "Focus on weak topics first.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 sm:p-6 flex flex-col space-y-4 h-full dark:bg-gray-800  bg-white bg-card dark:text-gray-100">
      <div className="flex items-center gap-2">
        <AiFillDropboxCircle />
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center sm:text-left">
          AI Study Suggestions
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="Enter topic or study area..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:w-auto"
        />
        <button
          onClick={fetchTips}
          className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition w-full sm:w-auto"
        >
          Generate
        </button>
      </div>

      {loading && (
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center sm:text-left">
          Thinking…
        </p>
      )}
      {error && (
        <p className="text-sm sm:text-base text-red-500 text-center sm:text-left">
          {error}
        </p>
      )}

      {!loading && !error && tips.length > 0 && (
        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base md:text-base">
          {tips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}
