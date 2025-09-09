import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import { FaBook, FaWallet, FaClipboardList } from "react-icons/fa";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import PerformanceDashboard from "./PerformanceDashboard";
import axiosInstance from "@/utils/axiosInstance";
import QuoteCard from "@/components/QuoteCard/QuoteCard";
import AISuggestions from "@/components/AISuggestions/AISuggestions";
import { MdDashboard } from "react-icons/md";
import PlannerDashboard from "./PlannerDashboard";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/StudyPlanner/Loader";

export default function Dashboard() {
  const [trendData, setTrendData] = useState([]);
  const [budgetTrendData, setBudgetTrendData] = useState([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [upcomingExams, setUpcomingExams] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [classesRes, budgetRes, questionsRes, attemptsRes] =
          await Promise.all([
            axiosInstance.get("/api/classes"),
            axiosInstance.get("/budget"),
            axiosInstance.get("/questions"),
            axiosInstance.get("/api/attempts"),
          ]);

        const classes = classesRes.data || [];
        setTotalClasses(classes.length);
        setTrendData(classes.map((cls) => ({ name: cls.name, value: 1 })));
        setUpcomingExams(classes.filter((cls) => cls.type === "Exam").length);

        const budgetData = budgetRes.data || [];
        const total = budgetData.reduce(
          (acc, item) =>
            item.type === "income" ? acc + item.amount : acc - item.amount,
          0
        );
        setTotalBudget(total);

        const budgetTrend = budgetData.map((item, index) => ({
          name: item.name || `Item ${index + 1}`,
          value: item.type === "income" ? item.amount : -item.amount,
        }));
        setBudgetTrendData(budgetTrend);

        const questions = questionsRes.data || [];
        const attemptsData = attemptsRes.data?.data || [];
        const mappedAttempts = attemptsData.map((a) => {
          const question = questions.find((q) => q._id === a.questionId);
          return {
            ...a,
            difficulty: question?.difficulty || "Easy",
            type: question?.type || "MCQ",
            questionText: question?.question || "",
          };
        });
        setAttempts(mappedAttempts);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0  flex items-center justify-center z-50">
        <Loader size={50} />
      </div>
    );

  return (
    <div className="w-full p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <MdDashboard className="text-3xl" />
          {user?.displayName
            ? `Welcome back, ${user.displayName}!`
            : "Welcome to Your Dashboard!"}
        </h2>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-wrap w-full sm:w-auto">
          <Link to="/classes" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 md:px-5 py-2 rounded-lg shadow-lg transition transform hover:scale-105">
              Add Class
            </button>
          </Link>

          <Link to="/budget" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-700 text-white px-3 md:px-5 py-2 rounded-lg shadow-lg transition transform hover:scale-105">
              Add Budget
            </button>
          </Link>

          <Link to="/exam" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-700 text-white px-3 md:px-5 py-2 rounded-lg shadow-lg transition transform hover:scale-105">
              Schedule Exam
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Classes */}
        <Card className="border dark:bg-gray-800  text-card-foreground p-6 rounded-xl shadow-xl hover:shadow-2xl transition transform hover:scale-105 flex flex-col justify-between min-h-[220px]">
          <div className="flex flex-col items-center">
            <FaBook className="text-3xl md:text-4xl mb-2 text-blue-600" />
            <p className="text-gray-600 font-medium">Total Classes</p>
            <p className="text-xl md:text-2xl font-bold">
              <CountUp end={totalClasses} duration={1.5} />
            </p>
          </div>
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart
              data={trendData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="classGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                fill="url(#classGradient)"
              />
              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Total Budget */}
        <Card className="border dark:bg-gray-800 text-card-foreground p-6 rounded-xl shadow-xl hover:shadow-2xl transition transform hover:scale-105 flex flex-col justify-between min-h-[220px]">
          <div className="flex flex-col items-center">
            <FaWallet className="text-3xl md:text-4xl mb-2 text-green-600" />
            <p className="text-gray-600 font-medium">Total Budget</p>
            <p className="text-xl md:text-2xl font-bold">
              $<CountUp end={totalBudget} duration={1.5} />
            </p>
          </div>
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={budgetTrendData}>
              <defs>
                <linearGradient id="budgetGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                fill="url(#budgetGradient)"
              />
              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Upcoming Exams */}
        <Card className="border dark:bg-gray-800 text-card-foreground p-6 rounded-xl shadow-xl hover:shadow-2xl transition transform hover:scale-105 flex flex-col justify-between min-h-[220px]">
          <div className="flex flex-col items-center">
            <FaClipboardList className="text-3xl md:text-4xl mb-2 text-red-600" />
            <p className="text-gray-600 font-medium">Upcoming Exams</p>
            <p className="text-xl md:text-2xl font-bold">
              <CountUp end={upcomingExams} duration={1.5} />
            </p>
          </div>
          <div className="w-full h-2 md:h-3 bg-red-200 rounded-full mt-2">
            <div
              className="bg-red-600 h-2 md:h-3 rounded-full transition-all duration-500"
              style={{ width: `${(upcomingExams / totalClasses) * 100 || 0}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Quote & AI Suggestions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <QuoteCard />
        </div>
        <div className="flex-1">
          <AISuggestions />
        </div>
      </div>

      {/* Performance Dashboard */}
      <PerformanceDashboard attempts={attempts} />
      <PlannerDashboard />
    </div>
  );
}
