import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function PerformanceDashboard({ attempts }) {
  // attempts = [{ questionId, correct, difficulty }]
  const total = attempts.length;
  const correctCount = attempts.filter((a) => a.correct).length;

  const difficultyData = ["Easy", "Medium", "Hard"].map((d) => ({
    name: d,
    count: attempts.filter((a) => a.difficulty === d && a.correct).length,
  }));

  const pieData = [
    { name: "Correct", value: correctCount },
    { name: "Incorrect", value: total - correctCount },
  ];

  const COLORS = ["#00C49F", "#FF8042"];

  return (
    <div className="p-6  rounded-xl shadow-xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        🎯 Performance Dashboard
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Summary Card */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:scale-105 transition transform">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Total Attempts
          </h3>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {total}
          </p>

          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Correct Answers
          </h3>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            {correctCount}
          </p>
        </div>

        {/* Bar Chart Card */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:scale-105 transition transform">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Correct by Difficulty
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={difficultyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Card */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:scale-105 transition transform">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Overall Accuracy
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value} answers`}
                contentStyle={{ backgroundColor: "#1f2937", color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
