// router.jsx
import React from "react";
import { createBrowserRouter } from "react-router";
import DashboardLayout from "@/pages/DashboardLayout";
import Login from "@/pages/Login";
import PrivateRoute from "./PrivateRoute";
import Classes from "@/components/Classes/Classes";
import Dashboard from "@/pages/Dashboard";
import BudgetTracker from "@/components/BudgetTracker/BudgetTracker";
import ExamQAGenerator from "@/components/ExamQAGenerator/ExamQAGenerator";
import StudyPlanner from "@/components/StudyPlanner/StudyPlanner";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/classes",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <Classes />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/budget",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <BudgetTracker />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/budget",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <BudgetTracker />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/study",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <StudyPlanner />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/exam",
    element: (
      <PrivateRoute>
        <DashboardLayout>
          <ExamQAGenerator />
        </DashboardLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Login />,
  },
]);

export default router;
