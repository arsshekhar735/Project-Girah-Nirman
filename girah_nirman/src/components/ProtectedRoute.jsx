import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken"); // or another auth flag

  if (!token) {
    // No token → go to auth page
    return <Navigate to="/admin-auth" replace />;
  }

  return children; // Authenticated → show the page
}
