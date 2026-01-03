import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Optional: specify required role
}

interface DecodedToken {
  username: string;
  role: string;
  exp: number;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = "admin" 
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  
  // No token - redirect to signin
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  try {
    // Decode and verify token
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Check if token expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to="/signin" replace />;
    }

    // Check role if required
    if (requiredRole && decoded.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    // Invalid token - clear and redirect
    localStorage.removeItem("token");
    return <Navigate to="/signin" replace />;
  }
}
