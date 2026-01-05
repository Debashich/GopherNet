import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;  // <-- ADD THIS
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false 
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in at all
  if (!token) {
    return <Navigate to="/signin" />;
  }

  // Logged in but trying to access admin routes without admin role
  if (requireAdmin && role !== "admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
