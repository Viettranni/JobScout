import React from "react";

const NavigationItem = ({ text }) => <div className="mt-3.5">{text}</div>;

const Footer = () => {
  const navigationItems = ["About", "Advice", "Jobs"];

  return (
    <footer className="flex flex-col bg-white overflow-hidden">
      <div className="flex flex-col items-center px-20 pt-20 pb-11 bg-indigo-950 w-full max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-w-full">
          <div className="flex flex-col w-[42%] max-md:w-full">
            <h1 className="text-6xl text-center text-white max-md:text-4xl max-md:pr-2 max-md:mt-10">JobScout</h1>
          </div>
          <nav className="flex flex-col w-1/5 max-md:w-full">
            <h2 className="text-2xl text-white font-semibold mt-7 max-md:mt-10">Navigation</h2>
            {navigationItems.map((item, index) => (
              <NavigationItem key={index} text={item} />
            ))}
          </nav>
          <address className="flex flex-col w-[38%] max-md:w-full">
            <h2 className="text-2xl text-white font-semibold mt-7 max-md:mt-10">Contact us</h2>
            <div className="mt-3.5">main@jobscout.com</div>
            <div className="mt-4">+35837502445</div>
          </address>
        </div>
        <div className="mt-32 text-2xl font-semibold text-white max-md:mt-10">Made by team 1</div>
      </div>
    </footer>
  );
};

export default Footer;
