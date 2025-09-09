// PerformanceDashboard.jsx
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";
import { CgPerformance } from "react-icons/cg"; // Import the missing icon

export default function PerformanceDashboard({ attempts }) {
  const total = attempts.length;
  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const incorrectCount = total - correctCount;

  const difficultyData = ["Easy", "Medium", "Hard"].map((d) => ({
    name: d,
    count: attempts.filter((a) => a.difficulty === d && a.isCorrect).length,
  }));

  const typeData = [
    { name: "MCQ", value: attempts.filter((a) => a.type === "MCQ").length },
    { name: "Short", value: attempts.filter((a) => a.type === "Short").length },
  ];

  const COLORS = ["#0ea5e9", "#3b82f6"]; // For Pie chart

  return (
    <div className=" space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <CgPerformance className="text-3xl" /> Student - Performance Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Card */}
        <Card className="p-6 flex flex-col space-y-3 shadow-lg hover:shadow-2xl transition transform hover:scale-105 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Summary
          </h3>
          <div className="space-y-1 text-gray-700 dark:text-gray-300">
            <p>
              Total Questions: <span className="font-bold">{total}</span>
            </p>
            <p>
              Correct:{" "}
              <span className="text-green-500 font-semibold">
                {correctCount}
              </span>
            </p>
            <p>
              Incorrect:{" "}
              <span className="text-red-500 font-semibold">
                {incorrectCount}
              </span>
            </p>
          </div>
        </Card>

        {/* Difficulty Chart */}
        <Card className="p-6 flex flex-col space-y-3 shadow-lg hover:shadow-2xl transition transform hover:scale-105 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Correct by Difficulty
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={difficultyData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="difficultyGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#C7D2FE" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="count"
                stroke="#4F46E5"
                fill="url(#difficultyGradient)"
                fillOpacity={1}
                activeDot={{ r: 6 }}
              />
              <Tooltip
                contentStyle={{
                  fontSize: "12px",
                  backgroundColor: "#f0f4f8",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "5px",
                }}
                formatter={(value) => [`${value}`, "Correct"]}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Question Type Pie Chart */}
        <Card className="p-6 flex flex-col space-y-3 shadow-lg hover:shadow-2xl transition transform hover:scale-105 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Question Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={typeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={40}
                paddingAngle={5}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {typeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: "12px",
                  backgroundColor: "#f0f4f8",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "5px",
                }}
                formatter={(value, name) => [`${value}`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
