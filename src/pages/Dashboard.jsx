// Dashboard.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance"; // তোমার axios instance
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

const COLORS = ["#4CAF50", "#F44336"]; // Attendance colors

export default function Dashboard() {
  const [trendData, setTrendData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [upcomingExams, setUpcomingExams] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get("/dashboard");
        const data = res.data[0]; // MongoDB array থেকে প্রথম object নেওয়া

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

  // Attendance safe access
  const presentValue =
    attendanceData.find((item) => item.name === "Present")?.value || 0;

  return (
    <div className="w-full p-4 md:p-6">
      {/* Header Buttons */}
      <div className="flex justify-between flex-col md:flex-row mb-10">
        <h2 className="text-3xl font-bold mb-6 md:mb-0 text-gray-800 dark:text-gray-100 text-center md:text-left">
          Dashboard Overview
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/classes">
            {" "}
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition shadow w-full sm:w-auto">
              Add Class
            </button>{" "}
          </Link>
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
            <CountUp end={totalClasses} duration={1.5} />
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
            $<CountUp end={totalBudget} duration={1.5} />
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
            <CountUp end={upcomingExams} duration={1.5} />
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
            <CountUp end={presentValue} duration={1.5} />%
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
