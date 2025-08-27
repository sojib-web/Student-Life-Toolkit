import React from "react";
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "@/pages/DashboardLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
  },
]);

export default router;
