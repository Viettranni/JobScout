import React from "react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center p-4 bg-white shadow-md">
      <div className="text-lg font-bold text-blue-900">JobScout</div>
      <div className="flex space-x-4">
        <a href="/" className="text-blue-900 hover:text-blue-700">
          Home
        </a>
        <a href="/about" className="text-blue-900 hover:text-blue-700">
          About
        </a>
        <a href="/contact" className="text-blue-900 hover:text-blue-700">
          Contact
        </a>
      </div>
      <div className="flex space-x-4">
        <button className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-700">
          Login
        </button>
        <button className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-700">
          Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
