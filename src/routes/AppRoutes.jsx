// router.jsx
import React from "react";
import { createBrowserRouter } from "react-router";
import DashboardLayout from "@/pages/DashboardLayout";
import Login from "@/pages/Login";
import PrivateRoute from "./PrivateRoute";
import Classes from "@/components/Classes/Classes";
import Dashboard from "@/pages/Dashboard";

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
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Login />,
  },
]);

export default router;
