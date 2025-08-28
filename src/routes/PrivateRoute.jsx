// PrivateRoute.jsx
import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Navigate } from "react-router";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
