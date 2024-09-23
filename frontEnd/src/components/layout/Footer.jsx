import PageLinks from "./PageLinks";
import React from "react";

const Footer = () => {
  
    return (
<<<<<<< HEAD
        <footer className="flex flex-col items-center p-5 w-full bg-indigo-950 max-md:px-5 max-md:max-w-full">
            <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl text-white">

                
                <h3 class="w-full md:w-[40%] text-center md:text-right text-4xl md:text-6xl md:mb-12">
                    Job$cout</h3>
                
                <PageLinks parentClass="flex flex-col grow w-[20%] md:mt-8 text-center text-2xl text-white whitespace-nowrap max-md:mt-10" itemClass="hover:text-indigo-300" />
                
                <div className="w-[40%] text-center md:text-start mt-8 md:mt-0">
                    <h4 className="font-semibold">Contact us:</h4>
                    <p className="mt-2">main@jobscout.com</p>
=======
        <footer className="flex flex-col items-center p-11 w-full bg-indigo-950 max-md:px-5 max-md:max-w-full">
            <div className="flex justify-between items-center p-4 w-full max-w-6xl text-white">

                <div class="relative w-[40%] h-32 pt-0.5 text-6xl text-white max-md:pr-2 max-md:mt-10 max-md:text-4xl">
                    <div class="absolute top-0 right-0 text-right p-2">
                        Job$cout</div>
                </div>
                
                <div className="w-[20%] text-center">
                    <PageLinks parentClass="flex flex-col grow mt-7 text-2xl text-white whitespace-nowrap max-md:mt-10" itemClass="hover:text-indigo-300" />
                </div>
                
                <div className="w-[40%] text-start pl-2">
                    <p className="font-semibold">Contact us:</p>
                    <p className="self-stretch mt-2">main@jobscout.com</p>
>>>>>>> vietbe
                    <p>+358-45-101-00-11</p>
                </div>

            </div>

            <div className="self-center mt-10 text-2xl font-semibold text-white max-md:mt-10">
                Made by team 1
            </div>
        </footer>
    );
  };
  
  export default Footer;