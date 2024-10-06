import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Ensure it's imported correctly
import { useNavigate } from "react-router-dom"; // For navigation
import { useAuth } from "./contextProvider";

const useAutoLogout = () => {
  const [user, setUser] = useState(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false); // State to manage session expiration modal visibility
  const navigate = useNavigate(); // React Router's navigation hook
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Function to handle session expiration
    function handleSessionExpiration(decodedToken) {
      const currentTime = Date.now();
      console.log(decodedToken.exp, currentTime);

      if (decodedToken.exp * 1000 <= currentTime) {
        handleLogout();
      } else {
        // Calculate time left until token expiration
        const timeLeft = decodedToken.exp * 1000 - currentTime;

        // Set a timeout for when the session expires
        const timeoutId = setTimeout(() => {
          console.log("Session expired");
          setIsSessionExpired(true); // Show session expiration modal when token expires
        }, timeLeft);

        // Cleanup timeout on component unmount or when the effect runs again
        return () => clearTimeout(timeoutId);
      }
    }

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({ firstname: decodedToken.firstname });

        // Handle session expiration logic
        handleSessionExpiration(decodedToken);
      } catch (error) {
        console.error("Token decoding failed:", error);
      }
    }
  }, []); // Run this effect once on component mount

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    logout();
    navigate("/", { replace: true }); // Redirect to the /home page after logout
    window.location.reload();
  };

  // Handle session expired modal button click
  const handleSessionExpired = () => {
    setIsSessionExpired(false);
    handleLogout();
  };

  return {
    user,
    isSessionExpired,
    handleLogout,
    handleSessionExpired,
  };
};

export default useAutoLogout;
