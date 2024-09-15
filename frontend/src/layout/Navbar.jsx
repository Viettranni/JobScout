import PageLinks from "./PageLinks";
import React from "react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center p-4 bg-white shadow-md">
      <a href="/home" className="text-lg font-bold text-blue-900">Job$cout</a>

      <PageLinks parentClass="flex space-x-4" itemClass="text-blue-900 hover:text-blue-700" />
      
      <div className="flex space-x-4">
        <button className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-700">
          Aply Now
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
