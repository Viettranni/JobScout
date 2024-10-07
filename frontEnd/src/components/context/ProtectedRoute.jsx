import { useAuth } from "./contextProvider";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Add loading state

  useEffect(() => {
    // Simulate token check and update the state
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in or register to access this page.");
    }

    // Simulate a delay for token checking to avoid premature redirect
    setTimeout(() => {
      setIsCheckingAuth(false);
    }, 500); // Simulating loading delay for better UX
  }, []);

  if (isCheckingAuth) {
    // Return a loading indicator or null while checking the auth status
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
}
