// Dashboard.jsx
import React from "react";
import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { FaBook, FaWallet, FaClipboardList, FaUserCheck } from "react-icons/fa";
import CountUp from "react-countup";

const COLORS = ["#4CAF50", "#F44336"]; // Attendance colors

// Trend data for small area charts
const trendData = [
  { day: "Mon", value: 100 },
  { day: "Tue", value: 200 },
  { day: "Wed", value: 150 },
  { day: "Thu", value: 300 },
  { day: "Fri", value: 250 },
  { day: "Sat", value: 400 },
  { day: "Sun", value: 350 },
];

// Area chart data
const areaData = [
  { day: "Mon", value: 120 },
  { day: "Tue", value: 200 },
  { day: "Wed", value: 150 },
  { day: "Thu", value: 250 },
  { day: "Fri", value: 300 },
  { day: "Sat", value: 200 },
  { day: "Sun", value: 270 },
];

// Attendance data
const attendanceData = [
  { name: "Present", value: 80 },
  { name: "Absent", value: 20 },
];

export default function Dashboard() {
  return (
    <div className="w-full p-4 md:p-6">
      {/* Header Buttons */}
      <div className="flex justify-between flex-col md:flex-row mb-10">
        <h2 className="text-3xl font-bold mb-6 md:mb-0 text-gray-800 dark:text-gray-100 text-center md:text-left">
          Dashboard Overview
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition shadow w-full sm:w-auto">
            Add Class
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition shadow w-full sm:w-auto">
            Add Budget
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition shadow w-full sm:w-auto">
            Schedule Exam
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {/* Total Classes */}
        <Card className="p-6 flex flex-col items-center justify-center text-gray-800 dark:text-gray-100 hover:shadow-lg transition w-full">
          <FaBook className="text-3xl mb-2 text-blue-500" />
          <p className="text-sm uppercase text-gray-500 dark:text-gray-400">
            Total Classes
          </p>
          <p className="text-2xl font-bold mt-1">
            <CountUp end={5} duration={1.5} />
          </p>
          <ResponsiveContainer width="100%" height={50}>
            <AreaChart data={trendData}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Total Budget */}
        <Card className="p-6 flex flex-col items-center justify-center text-gray-800 dark:text-gray-100 hover:shadow-lg transition w-full">
          <FaWallet className="text-3xl mb-2 text-green-500" />
          <p className="text-sm uppercase text-gray-500 dark:text-gray-400">
            Total Budget
          </p>
          <p className="text-2xl font-bold mt-1">
            $<CountUp end={1000} duration={1.5} />
          </p>
          <ResponsiveContainer width="100%" height={50}>
            <AreaChart data={trendData}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Upcoming Exams */}
        <Card className="p-6 flex flex-col items-center justify-center text-gray-800 dark:text-gray-100 hover:shadow-lg transition w-full">
          <FaClipboardList className="text-3xl mb-2 text-red-500" />
          <p className="text-sm uppercase text-gray-500 dark:text-gray-400">
            Upcoming Exams
          </p>
          <p className="text-2xl font-bold mt-1">
            <CountUp end={3} duration={1.5} />
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-2">
            <div className="bg-red-500 h-4 rounded-full w-2/3" />
          </div>
        </Card>

        {/* Attendance Rate */}
        <Card className="p-6 flex flex-col items-center justify-center text-gray-800 dark:text-gray-100 hover:shadow-lg transition w-full">
          <FaUserCheck className="text-3xl mb-2 text-purple-500" />
          <p className="text-sm uppercase text-gray-500 dark:text-gray-400">
            Attendance Rate
          </p>
          <p className="text-2xl font-bold mt-1">
            <CountUp end={80} duration={1.5} />%
          </p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={attendanceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {attendanceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{ backgroundColor: "#1f2937", color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Weekly Performance Area Chart */}
      <Card className="p-6 hover:shadow-lg transition w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 text-center md:text-left">
          Weekly Performance
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={areaData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
