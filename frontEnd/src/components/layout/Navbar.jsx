import PageLinks from "./PageLinks";
import React from "react";
import { Button } from '../ui/button';
import LoginModal from './LoginModal'


const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center p-4 bg-white shadow-md">
      <a href="/home" className="text-lg font-bold text-blue-900">Job$cout</a>

      <PageLinks parentClass="flex space-x-4" itemClass="text-blue-900 hover:text-blue-700" />
      
      <div className="flex space-x-4">
        <LoginModal 
          trigger={
            <Button className="bg-indigo-950 text-white py-2 px-4 rounded hover:bg-hover">
              Sign In / Register
            </Button>
          }
        />
      </div>
    </nav>
  );
};

export default Navbar;