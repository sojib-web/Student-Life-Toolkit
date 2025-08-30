import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#4CAF50", "#F44336"];

const dummyData = [
  {
    _id: 1,
    type: "income",
    category: "Scholarship",
    amount: 500,
    date: "2025-08-30",
    description: "Monthly scholarship",
  },
  {
    _id: 2,
    type: "expense",
    category: "Food",
    amount: 120,
    date: "2025-08-29",
    description: "Lunch & Snacks",
  },
  {
    _id: 3,
    type: "income",
    category: "Part-time Job",
    amount: 200,
    date: "2025-08-28",
    description: "Weekend job",
  },
  {
    _id: 4,
    type: "expense",
    category: "Transport",
    amount: 50,
    date: "2025-08-30",
    description: "Bus fare",
  },
];

const BudgetTracker = () => {
  const [budgetData, setBudgetData] = useState(dummyData);

  // PieChart Data
  const data = [
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

  return (
    <div className="space-y-6">
      <Card className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 shadow-xl">
        <h2 className="text-xl font-bold mb-4">💰 Budget Tracker (Dummy)</h2>

        {/* Pie Chart */}
        <div className="flex justify-center mb-4">
          <PieChart width={200} height={200}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* List */}
        <div className="space-y-2">
          {budgetData.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center p-2 bg-white rounded shadow"
            >
              <div>
                <p className="font-medium">
                  {item.category} ({item.type})
                </p>
                <p>
                  ${item.amount} - {item.date}
                </p>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
              <button className="text-red-500 hover:text-red-700 cursor-not-allowed opacity-50">
                Delete
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default BudgetTracker;
