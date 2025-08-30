import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
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
import { Link } from "react-router";

import PomodoroTimer from "@/components/PomodoroTimer/PomodoroTimer";
import AISuggestions from "@/components/AISuggestions/AISuggestions";
import QuoteCard from "@/components/QuoteCard/QuoteCard";

const COLORS = ["#4CAF50", "#F44336"];

export default function Dashboard() {
  const [trendData, setTrendData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [upcomingExams, setUpcomingExams] = useState(0);
  const [weakTopics, setWeakTopics] = useState(["Algebra", "Physics"]); // Example weak topics

  const [showPomodoro, setShowPomodoro] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get("/dashboard");
        const data = res.data[0];

        if (data) {
          setTrendData(data.classTrend || []);
          setAreaData(data.weeklyPerformance || []);
          setAttendanceData(data.attendance || []);
          setTotalClasses(data.totalClasses || 0);
          setTotalBudget(data.totalBudget || 0);
          setUpcomingExams(data.upcomingExams || 0);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    fetchDashboard();
  }, []);

  const presentValue =
    attendanceData.find((item) => item.name === "Present")?.value || 0;

  return (
    <div className="w-full p-6 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
          📊 Dashboard Overview
        </h2>
        <div className="flex gap-4 flex-wrap">
          <Link to="/classes">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-lg transition transform hover:scale-105">
              Add Class
            </button>
          </Link>
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-lg transition transform hover:scale-105">
            Add Budget
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg shadow-lg transition transform hover:scale-105">
            Schedule Exam
          </button>

          {/* Buttons to show components */}
          <button
            onClick={() => setShowPomodoro((v) => !v)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-lg transition transform hover:scale-105"
          >
            Pomodoro Timer
          </button>
          <button
            onClick={() => setShowAI((v) => !v)}
            className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg shadow-lg transition transform hover:scale-105"
          >
            AI Suggestions
          </button>
          <button
            onClick={() => setShowQuote((v) => !v)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-lg transition transform hover:scale-105"
          >
            Daily Motivation
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Classes */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex flex-col items-center rounded-xl shadow-xl hover:scale-105 transition transform">
          <FaBook className="text-4xl mb-2 text-blue-600" />
          <p className="text-gray-600 font-medium">Total Classes</p>
          <p className="text-2xl font-bold">
            <CountUp end={totalClasses} duration={1.5} />
          </p>
          <ResponsiveContainer width="100%" height={40}>
            <AreaChart data={trendData}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Total Budget */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 p-6 flex flex-col items-center rounded-xl shadow-xl hover:scale-105 transition transform">
          <FaWallet className="text-4xl mb-2 text-green-600" />
          <p className="text-gray-600 font-medium">Total Budget</p>
          <p className="text-2xl font-bold">
            $<CountUp end={totalBudget} duration={1.5} />
          </p>
          <ResponsiveContainer width="100%" height={40}>
            <AreaChart data={trendData}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Upcoming Exams */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 p-6 flex flex-col items-center rounded-xl shadow-xl hover:scale-105 transition transform">
          <FaClipboardList className="text-4xl mb-2 text-red-600" />
          <p className="text-gray-600 font-medium">Upcoming Exams</p>
          <p className="text-2xl font-bold">
            <CountUp end={upcomingExams} duration={1.5} />
          </p>
          <div className="w-full h-3 bg-red-200 rounded-full mt-2">
            <div className="bg-red-600 h-3 rounded-full w-2/3" />
          </div>
        </Card>

        {/* Attendance Rate */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 flex flex-col items-center rounded-xl shadow-xl hover:scale-105 transition transform">
          <FaUserCheck className="text-4xl mb-2 text-purple-600" />
          <p className="text-gray-600 font-medium">Attendance Rate</p>
          <p className="text-2xl font-bold">{presentValue}%</p>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={attendanceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={3}
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

      {/* Conditional Hero Section */}
      {(showPomodoro || showAI || showQuote) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {showPomodoro && <PomodoroTimer />}
          {showAI && (
            <AISuggestions
              summary={{
                totalClasses,
                upcomingExams,
                weakTopics,
                weeklyPerformance: areaData.map((item) => item.value),
              }}
            />
          )}
          {showQuote && <QuoteCard />}
        </div>
      )}

      {/* Weekly Performance Chart */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-xl hover:scale-105 transition transform">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
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
