// PlannerDashboard.jsx
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import axiosInstance from "@/utils/axiosInstance";

export default function PlannerDashboard() {
  const [plannerData, setPlannerData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detect dark mode
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const match = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(match.matches);
    const listener = (e) => setDarkMode(e.matches);
    match.addEventListener("change", listener);
    return () => match.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    const fetchPlanner = async () => {
      try {
        const res = await axiosInstance.get("/planner");
        const data = res.data;

        const chartData = Object.keys(data)
          .sort()
          .map((date) => {
            const tasks = data[date];
            const completed = tasks.filter((t) => t.completed).length;
            const pending = tasks.filter((t) => !t.completed).length;
            const high = tasks.filter((t) => t.priority === "High").length;
            const medium = tasks.filter((t) => t.priority === "Medium").length;
            const low = tasks.filter((t) => t.priority === "Low").length;

            return { date, completed, pending, high, medium, low };
          });

        setPlannerData(chartData);
      } catch (error) {
        console.error("Planner fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanner();
  }, []);

  if (loading)
    return (
      <p className="text-gray-500 dark:text-gray-300 text-center mt-10">
        Loading Planner Data…
      </p>
    );

  return (
    <Card className="p-6 bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        🗓 Planner Dashboard
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={plannerData}
          margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke={darkMode ? "#374151" : "#e5e7eb"}
          />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: darkMode ? "#d1d5db" : "#6b7280" }}
            tickLine={false}
            axisLine={{ stroke: darkMode ? "#4b5563" : "#d1d5db" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: darkMode ? "#d1d5db" : "#6b7280" }}
            tickLine={false}
            axisLine={{ stroke: darkMode ? "#4b5563" : "#d1d5db" }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#1f2937" : "#f9fafb",
              color: darkMode ? "#f9fafb" : "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              padding: "8px",
              fontSize: "13px",
            }}
          />

          <Legend
            verticalAlign="top"
            wrapperStyle={{
              fontSize: "13px",
              paddingBottom: 10,
              color: darkMode ? "#f9fafb" : "#111827",
            }}
          />

          <defs>
            {/* Completed / Pending bars gradient */}
            <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={darkMode ? "#059669" : "#10B981"}
                stopOpacity={1}
              />
              <stop
                offset="100%"
                stopColor={darkMode ? "#064e3b" : "#10B981"}
                stopOpacity={0.6}
              />
            </linearGradient>
            <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={darkMode ? "#d97706" : "#F59E0B"}
                stopOpacity={1}
              />
              <stop
                offset="100%"
                stopColor={darkMode ? "#78350f" : "#F59E0B"}
                stopOpacity={0.6}
              />
            </linearGradient>

            {/* Lines gradients */}
            <linearGradient id="highLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#fee2e2" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="mediumLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#facc15" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#fef3c7" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="lowLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#bfdbfe" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          {/* Bars */}
          <Bar
            dataKey="completed"
            stackId="a"
            fill="url(#completedGradient)"
            radius={[6, 6, 0, 0]}
            barSize={18}
          />
          <Bar
            dataKey="pending"
            stackId="a"
            fill="url(#pendingGradient)"
            radius={[6, 6, 0, 0]}
            barSize={18}
          />

          {/* Lines */}
          <Area
            type="monotone"
            dataKey="high"
            stroke="#ef4444"
            fill="url(#highLine)"
            fillOpacity={1}
            activeDot={{
              r: 5,
              stroke: "#fff",
              strokeWidth: 2,
              fill: "#ef4444",
            }}
          />
          <Area
            type="monotone"
            dataKey="medium"
            stroke="#facc15"
            fill="url(#mediumLine)"
            fillOpacity={1}
            activeDot={{
              r: 5,
              stroke: "#fff",
              strokeWidth: 2,
              fill: "#facc15",
            }}
          />
          <Area
            type="monotone"
            dataKey="low"
            stroke="#3b82f6"
            fill="url(#lowLine)"
            fillOpacity={1}
            activeDot={{
              r: 5,
              stroke: "#fff",
              strokeWidth: 2,
              fill: "#3b82f6",
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}
