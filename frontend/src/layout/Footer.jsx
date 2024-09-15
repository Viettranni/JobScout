import React from "react";

const NavigationItem = ({ text }) => <div className="mt-3.5">{text}</div>;

const Footer = () => {
  const navigationItems = ["About", "Advice", "Jobs"];

  return (
    <footer className="flex overflow-hidden flex-col bg-white">
      <div className="flex flex-col items-center px-20 pt-20 pb-11 w-full bg-indigo-950 max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col ml-9 max-w-full w-[812px]">
          <div className="max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <div className="flex flex-col w-[42%] max-md:ml-0 max-md:w-full">
                <h1 className="pt-0.5 text-6xl text-center text-white max-md:pr-2 max-md:mt-10 max-md:text-4xl">
                  JobScout
                </h1>
              </div>
              <nav className="flex flex-col ml-5 w-1/5 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow items-start mt-7 text-2xl text-white whitespace-nowrap max-md:mt-10">
                  <h2 className="self-stretch font-semibold">Navigation</h2>
                  {navigationItems.map((item, index) => (
                    <NavigationItem key={index} text={item} />
                  ))}
                </div>
              </nav>
              <address className="flex flex-col ml-5 w-[38%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col items-start self-stretch my-auto text-2xl text-white max-md:mt-10">
                  <h2 className="font-semibold">Contact us</h2>
                  <div className="self-stretch mt-3.5">main@jobscout.com</div>
                  <div className="mt-4">+35837502445</div>
                </div>
              </address>
            </div>
          </div>
          <div className="self-center mt-32 text-2xl font-semibold text-white max-md:mt-10">
            Made by team 1
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
