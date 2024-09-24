import React, { useEffect, useState } from "react"; // Ensure useEffect is imported
import PageLinks from "./PageLinks";
import { Button } from '../ui/button';
import LoginModal from './LoginModal';
import { jwtDecode } from 'jwt-decode'; 

const Navbar = () => {
  const [user, setUser] = useState(null); // Local state to hold user info

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from local storage

    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        setUser({ firstname: decodedToken.firstname }); // Set user state with decoded info
      } catch (error) {
        console.error("Token decoding failed:", error); // Handle decoding error
      }
    }
  }, []); // Run this effect once on component mount

  //  Logout logic
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    setUser(null); // Reset user state
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center p-4 bg-white shadow-md">
      <a href="/" className="text-lg font-bold text-blue-900">Job$cout</a>

      <PageLinks parentClass="flex space-x-4" itemClass="text-blue-900 hover:text-blue-700" />
      
      <div className="flex space-x-4">
        {user ? ( // Check if user exists
          <>
            <span className="text-blue-900 mt-2">{user.firstname}</span>
            <Button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500" onClick={handleLogout}>Logout</Button>
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
  );
};

export default Navbar;
