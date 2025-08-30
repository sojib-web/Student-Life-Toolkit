import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import axiosInstance from "@/utils/axiosInstance";

export default function AISuggestions({ summary }) {
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState([]);
  const [error, setError] = useState("");

  console.log(summary);
  const fetchTips = async () => {
    if (!summary) return;
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/ai/suggest", {
        totalClasses: summary.totalClasses,
        upcomingExams: summary.upcomingExams,
        weakTopics: summary.weakTopics || [],
        weeklyPerformance: summary.weeklyPerformance || [],
      });
      setTips(res.data.tips || []);
    } catch (e) {
      console.error("AI fetch error:", e.response || e.message);

      // Show proper error from backend
      setError(
        e.response?.data?.message ||
          "Failed to load AI suggestions. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, [summary]);

  return (
    <Card className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl hover:shadow-2xl transition transform hover:scale-105 h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          🤖 AI Study Suggestions
        </h3>
        <button
          onClick={fetchTips}
          className="px-3 py-1 text-sm rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300 transition"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Thinking…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 flex-1">
          {tips.length === 0 && <li>No suggestions available.</li>}
          {tips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}
