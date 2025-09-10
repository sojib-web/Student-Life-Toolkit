// router.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "@/pages/DashboardLayout";
import Login from "@/pages/Login";
import PrivateRoute from "./PrivateRoute";
import Classes from "@/components/Classes/Classes";
import Dashboard from "@/pages/Dashboard";
import BudgetTracker from "@/components/BudgetTracker/BudgetTracker";
import ExamQAGenerator from "@/components/ExamQAGenerator/ExamQAGenerator";
import StudyPlanner from "@/components/StudyPlanner/StudyPlanner";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "classes",
        element: <Classes />,
      },
      {
        path: "budget",
        element: <BudgetTracker />,
      },
      {
        path: "study",
        element: <StudyPlanner />,
      },
      {
        path: "exam",
        element: <ExamQAGenerator />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
