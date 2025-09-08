import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import axiosInstance from "@/utils/axiosInstance";
import { AiFillApi } from "react-icons/ai";

export default function QuoteCard() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper: Extract author if format is "quote — author"
  const parseQuote = (text) => {
    if (!text) return { quote: "", author: "Unknown" };
    if (text.includes("—")) {
      const parts = text.split("—");
      return { quote: parts[0].trim(), author: parts[1].trim() };
    }
    if (text.includes(",")) {
      const parts = text.split(",");
      return { quote: parts[0].trim(), author: parts[1].trim() };
    }
    return { quote: text.trim(), author: "Unknown" };
  };

  const fetchQuote = async () => {
    setLoading(true);
    setError("");

    // Random language: English or Bengali
    const languages = ["en", "bn"];
    const lang = languages[Math.floor(Math.random() * languages.length)];

    try {
      const res = await axiosInstance.post("/api/generate-questions", {
        topic:
          lang === "en"
            ? "Motivational quotes for students with author name"
            : "ছাত্রদের জন্য প্রেরণামূলক উক্তি, লেখকের নাম সহ",
        count: 1,
        lang: lang,
      });

      const rawQuote =
        res.data.questions && res.data.questions.length > 0
          ? res.data.questions[0].question
          : lang === "en"
          ? "Stay positive, work hard, and make it happen! — Unknown"
          : "সকারাত্মক থাকো, কঠোর পরিশ্রম করো, এবং তা বাস্তবায়ন করো! — অজানা";

      const { quote: qText, author: qAuthor } = parseQuote(rawQuote);

      setQuote(qText);
      setAuthor(qAuthor);
    } catch (err) {
      console.error(err);
      setError(
        lang === "en"
          ? "Failed to load quote. Showing fallback."
          : "উক্তি লোড করতে ব্যর্থ। বিকল্প দেখানো হচ্ছে।"
      );

      const fallback =
        lang === "en"
          ? "Stay positive, work hard, and make it happen! — Unknown"
          : "সকারাত্মক থাকো, কঠোর পরিশ্রম করো, এবং তা বাস্তবায়ন করো! — অজানা";

      const { quote: qText, author: qAuthor } = parseQuote(fallback);
      setQuote(qText);
      setAuthor(qAuthor);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <Card className="p-6 flex flex-col justify-between dark:bg-gray-800 h-full">
      <div className="flex items-center gap-2 mb-3">
        <AiFillApi className="text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
          Daily Motivation
        </h3>
      </div>

      {loading ? (
        <p className="text-gray-500 italic text-center sm:text-left">
          Loading…
        </p>
      ) : error ? (
        <p className="text-red-500 italic text-center sm:text-left">{error}</p>
      ) : (
        <div className="flex flex-col justify-between h-full">
          <p className="italic text-gray-700 dark:text-gray-300 flex-1 text-center sm:text-left text-base sm:text-lg md:text-xl leading-relaxed">
            “{quote}”
          </p>
          <p className="mt-4 text-sm sm:text-base text-right text-gray-500">
            — {author}
          </p>
        </div>
      )}

      <button
        onClick={fetchQuote}
        className="mt-4 self-end px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg  transition"
      >
        Refresh
      </button>
    </Card>
  );
}
