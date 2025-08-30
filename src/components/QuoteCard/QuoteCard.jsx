import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

const fallbackQuotes = [
  {
    content: "Stay positive, work hard, and make it happen!",
    author: "Unknown",
  },
  {
    content:
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    content: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
  },
];

export default function QuoteCard() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const cached = localStorage.getItem("sl_daily_quote");
    const cachedDate = localStorage.getItem("sl_daily_quote_date");
    const today = new Date().toDateString();

    if (cached && cachedDate === today) {
      const { content, author } = JSON.parse(cached);
      setQuote(content);
      setAuthor(author);
      return;
    }

    fetch("https://api.quotable.io/random")
      .then((r) => r.json())
      .then((data) => {
        if (data?.content && data?.author) {
          setQuote(data.content);
          setAuthor(data.author);
          localStorage.setItem(
            "sl_daily_quote",
            JSON.stringify({ content: data.content, author: data.author })
          );
          localStorage.setItem("sl_daily_quote_date", today);
        } else {
          throw new Error("Invalid API response");
        }
      })
      .catch(() => {
        // Random fallback quote
        const fallback =
          fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        setQuote(fallback.content);
        setAuthor(fallback.author);
        localStorage.setItem(
          "sl_daily_quote",
          JSON.stringify({ content: fallback.content, author: fallback.author })
        );
        localStorage.setItem("sl_daily_quote_date", today);
      });
  }, []);

  return (
    <Card className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl hover:shadow-2xl transition transform hover:scale-105 h-full flex flex-col">
      <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100">
        💡 Daily Motivation
      </h3>
      <p className="italic text-gray-700 dark:text-gray-300 flex-1 text-center text-lg">
        “{quote}”
      </p>
      <p className="mt-4 text-sm text-right text-gray-500">— {author}</p>
    </Card>
  );
}
