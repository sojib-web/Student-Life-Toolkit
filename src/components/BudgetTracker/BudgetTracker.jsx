import React, { useState, useEffect } from "react";
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
import axiosInstance from "@/utils/axiosInstance";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { FaEdit } from "react-icons/fa";

import Header from "../StudyPlanner/Header";

const ITEMS_PER_PAGE = 2;

const BudgetTracker = () => {
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({
    type: "income",
    category: "",
    amount: "",
    date: "",
    description: "",
  });
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  // Fetch budget data
  const fetchBudgetData = async () => {
    try {
      const response = await axiosInstance.get("/budget");
      setBudgetData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching budget data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  // Add / Edit budget item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const response = await axiosInstance.put(`/budget/${editingItem._id}`, {
          ...form,
          amount: Number(form.amount),
        });
        setBudgetData(
          budgetData.map((item) =>
            item._id === editingItem._id ? response.data : item
          )
        );
        setEditingItem(null);
      } else {
        const response = await axiosInstance.post("/budget", {
          ...form,
          amount: Number(form.amount),
        });
        setBudgetData([...budgetData, response.data]);
      }
      setForm({
        type: "income",
        category: "",
        amount: "",
        date: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding/editing budget item:", error);
    }
  };

  // Delete budget item
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/budget/${id}`);
      setBudgetData(budgetData.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Edit budget item
  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({
      type: item.type,
      category: item.category,
      amount: item.amount,
      date: item.date,
      description: item.description,
    });
  };

  // Filtered & Paginated Data
  const filteredData = budgetData.filter(
    (item) =>
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Pie chart data
  const pieData = [
    {
      name: "Income",
      value: budgetData
        .filter((d) => d.type === "income")
        .reduce((a, b) => a + b.amount, 0),
    },
    {
      name: "Expense",
      value: budgetData
        .filter((d) => d.type === "expense")
        .reduce((a, b) => a + b.amount, 0),
    },
  ];

  // Area chart data sorted by date
  const sortedData = [...budgetData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Highlight utility
  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          className="bg-yellow-200 dark:bg-yellow-500 font-semibold"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 dark:text-gray-300">
        Loading...
      </p>
    );

  return (
    <div className="mx-auto p-6 space-y-8">
      <h2 className="flex items-center justify-center gap-2 text-4xl font-bold text-center">
        <Header
          title="Smart Budget Tracker"
          subtitle="Track your income & expenses"
        />
      </h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by category or description"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
        className="border rounded-lg px-3 py-2 shadow-sm w-full mb-4
             bg-white text-gray-800 placeholder-gray-400
             dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
      />

      {/* Form */}
      <Card className="p-6 shadow-xl rounded-2xl bg-white/70 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-6 gap-4"
        >
          <select
            className="border rounded-lg px-3 py-2 shadow-sm bg-white dark:bg-gray-700 dark:text-white"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="text"
            placeholder="Category"
            className="border rounded-lg px-3 py-2 shadow-sm bg-white dark:bg-gray-700 dark:text-white"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Amount"
            className="border rounded-lg px-3 py-2 shadow-sm bg-white dark:bg-gray-700 dark:text-white"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />

          <input
            type="date"
            className="border rounded-lg px-3 py-2 shadow-sm bg-white dark:bg-gray-700 dark:text-white"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Description"
            className="border rounded-lg px-3 py-2 shadow-sm bg-white dark:bg-gray-700 dark:text-white"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Button
            type="submit"
            className="flex items-center gap-2 bg-gray-900 text-white hover:scale-105 transition-transform"
          >
            <PlusCircle size={18} />
            {editingItem ? "Update" : "Add"}
          </Button>
        </form>
      </Card>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="p-6 shadow-lg rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Income vs Expense
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="expenseGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#F87171" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="url(#colorValue)"
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={
                      entry.name === "Income"
                        ? "url(#incomeGradient)"
                        : "url(#expenseGradient)"
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1f2937" : "#fff",
                  borderRadius: "10px",
                  border: "none",
                  color: isDark ? "#fff" : "#000",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Area Chart */}
        <Card className="p-6 shadow-lg rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Budget Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sortedData}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#555" : "#e0e0e0"}
              />
              <XAxis dataKey="date" stroke={isDark ? "#fff" : "#000"} />
              <YAxis stroke={isDark ? "#fff" : "#000"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1f2937" : "#fff",
                  borderRadius: "10px",
                  border: "none",
                  color: isDark ? "#fff" : "#000",
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#10B981"
                fill="url(#areaGradient)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="p-6 shadow-xl rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Transactions
        </h3>
        <div className="space-y-4">
          {paginatedData.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-300 mt-4">
              Transactions not found
            </p>
          ) : (
            paginatedData.map((item) => (
              <div
                key={item._id}
                className={`flex justify-between items-center p-4 rounded-xl shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg border-l-4 ${
                  item.type === "income" ? "border-green-500" : "border-red-500"
                } ${
                  isDark ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-800"
                }`}
              >
                <div>
                  <p className="font-semibold">
                    {highlightText(item.category, searchQuery)} ({item.type})
                  </p>
                  <p>
                    ${item.amount} • {item.date}
                  </p>
                  <p className="text-sm text-gray-400">
                    {highlightText(item.description, searchQuery)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => handleEdit(item)} size="icon">
                    <FaEdit />
                  </Button>
                  <Button
                    onClick={() => handleDelete(item._id)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))
          )}

          {/* Pagination */}
          {paginatedData.length > 0 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                  className="px-4"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BudgetTracker;
