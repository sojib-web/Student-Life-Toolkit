import React from "react";
import { createBrowserRouter } from "react-router";
import DashboardLayout from "@/pages/DashboardLayout";
import Login from "@/pages/Login";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />, // login form
  },
  {
    path: "/signup",
    element: <Login />, // signup form
  },
]);

export default router;
