import React, { useEffect, useState } from "react";
import PageLinks from "./PageLinks";
import { Button } from "../ui/button";
import LoginModal from "./LoginModal";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false); // State to manage session expiration modal visibility

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({ firstname: decodedToken.firstname });

        // Check if the token is expired
        const currentTime = Date.now();
        if (decodedToken.exp * 1000 <= currentTime) {
          handleLogout();
        } else {
          // Set up a timer to show the modal when the token expires
          const timeLeft = decodedToken.exp * 1000 - currentTime;

          setTimeout(() => {
            setIsSessionExpired(true); // Show session expiration modal when token expires
          }, timeLeft);
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
      }
    }
  }, []); // Run this effect once on component mount

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.reload();
  };

  // Handle session expired modal button click
  const handleSessionExpired = () => {
    setIsSessionExpired(false);
    handleLogout();
  };

  return (
    <>
      <nav className="sticky top-0 z-50 flex justify-between items-center py-4 px-6 bg-white shadow-md backdrop-blur">
        {/* Logo Section */}
        <a href="/" className="text-2xl font-bold text-blue-900">
          Job$cout
        </a>

        {/* Centered Navigation Links */}
        <div className="flex-grow flex justify-center">
          <PageLinks
            parentClass="flex space-x-6"
            itemClass="text-blue-900 hover:text-blue-700 text-lg font-medium"
            isSearchButtonSpecial={true}
          />
        </div>

        {/* Sign In/Register Button */}
        <div className="flex space-x-4 font-medium">
          {user ? (
            <>
              <a href="/profile" className="text-blue-900 mt-2">
                Profile
              </a>
              <span className="text-blue-900 mt-2">{user.firstname}</span>
              <Button
                className="bg-transparent text-red-700 hover:text-white py-2 px-4 rounded hover:bg-red-700 border border-red-700"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <LoginModal
              trigger={
                <Button className="bg-indigo-950 text-white py-2 px-4 rounded hover:bg-hover">
                  Sign In / Register
                </Button>
              }
            />
          )}
        </div>
      </nav>

      {/* Session Expiration Modal */}
      {isSessionExpired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
            <h2 className="text-xl font-semibold text-red-600">
              Session Expired
            </h2>
            <p>
              Your session has expired. Please log in again to continue using
              all features.
            </p>
            <Button
              className="bg-indigo-950 text-white py-2 px-4 rounded hover:bg-indigo-900"
              onClick={handleSessionExpired}
            >
              Okay
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
