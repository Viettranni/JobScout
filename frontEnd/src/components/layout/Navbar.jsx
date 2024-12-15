import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageLinks from "./PageLinks";
import { Button } from "../ui/button";
import LoginModal from "./LoginModal";
import useAutoLogout from "../context/useAutoLogout";
import { Menu, X } from "lucide-react";
import { useUser } from "../context/UserContext"; // Import the user context
import Loading from "../routes/common/Loading";

const url = import.meta.env.VITE_API_URL || "http://localhost:4000";


export default function Navbar() {
  const { user, loading } = useUser(); // Access user and loading state from context
  const { isSessionExpired, handleLogout, handleSessionExpired } =
    useAutoLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  if (loading) {
    return <Loading message="Loading user data..." />;
  }

  const profileImageUrl = user?.profileImage
    ? `${url}/${user.profileImage}`
    : "/assets/avatars/avatar1.png";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md backdrop-blur">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-blue-900">
                Job$cout
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <PageLinks
                parentClass="flex space-x-4"
                itemClass="text-blue-900 hover:text-blue-700 text-lg font-medium"
                isSearchButtonSpecial={true}
              />
            </div>

            {/* Desktop Sign In/Register Section */}
            <div className="hidden md:flex items-center space-x-4 font-medium">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-blue-900"
                  >
                    <span className="text-lg">{user.firstname}</span>
                    <img
                      src={profileImageUrl}
                      alt={`${user.firstname} ${user.lastname}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                  <Button
                    className="bg-transparent text-red-700 hover:text-white py-2 px-4 rounded hover:bg-red-700 border border-red-700"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                onClick={toggleMenu}
                className="bg-transparent text-blue-900"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <PageLinks
                parentClass="flex justify-center space-x-4" // deleted space-y-2 from here to fix the misalignment in mobile screens

                itemClass="text-blue-900 hover:text-blue-700 text-lg font-medium block px-3 py-2 rounded-md"
                isSearchButtonSpecial={false}
              />
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <div className="flex flex-col items-center space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-blue-900"
                  >
                    <span className="font-bold">
                      {user.firstname} {user.lastname}
                    </span>
                  </Link>
                  <Button
                    className="bg-transparent text-red-700 hover:text-white py-2 px-4 rounded hover:bg-red-700 border border-red-700 w-[90%]"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <LoginModal
                    trigger={
                      <Button className="bg-indigo-950 text-white py-2 px-4 rounded hover:bg-hover w-full">
                        Sign In / Register
                      </Button>
                    }
                  />
                </div>
              )}
            </div>
          </div>
        )}
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
}
