import React, { useState, useEffect } from "react";
import JobCategoryCard from "./CategoryCard";
import SearchBar from "./SearchBar";
import jobScoutImg from "../../../assets/JobScoutLandingImg.png";
import {
  MonitorIcon,
  CircuitBoardIcon,
  MessageSquareIcon,
  BarChartIcon,
  MoreHorizontalIcon,
  BookOpenIcon,
  UsersIcon,
} from "lucide-react";

// Has to work with backEnd info !!!
const jobCategories = [
  {
    icon: <MonitorIcon className="w-8 h-8" />,
    title: "Design",
    description: "147 new jobs posted last week",
  },
  {
    icon: <CircuitBoardIcon className="w-8 h-8" />,
    title: "Technology",
    description: "263 new jobs posted last week",
  },
  {
    icon: <MessageSquareIcon className="w-8 h-8" />,
    title: "Marketing",
    description: "47 new jobs posted last week",
  },
  {
    icon: <BarChartIcon className="w-8 h-8" />,
    title: "Finance",
    description: "78 new jobs posted last week",
  },
  {
    icon: <BookOpenIcon className="w-8 h-8" />,
    title: "Education",
    description: "92 new jobs posted last week",
  },
  // { icon: <UsersIcon className="w-8 h-8" />, title: 'Human Resources', description: '54 new jobs posted last week' },
  {
    icon: <MoreHorizontalIcon className="w-8 h-8" />,
    title: "Find More",
    description: "",
  },
];

function JobSearchComponent() {
  const [visibleBlocks, setVisibleBlocks] = useState(jobCategories.length);
  const [isColumn, setIsColumn] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleBlocks(3);
        setIsColumn(true);
      } else {
        setIsColumn(false);
        if (width < 1024) setVisibleBlocks(3);
        else if (width < 1280) setVisibleBlocks(4);
        else setVisibleBlocks(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="flex flex-col bg-white">
      {/* search component */}

      <section
        className="flex-grow flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-20 py-8 sm:py-12 md:py-16 lg:py-20 bg-indigo-950 rounded-b-xl"
        style={{
          backgroundImage: `url(${jobScoutImg})`,
          backgroundSize: "100%",
          backgroundPosition: "bottom center",
          backgroundRepeat: "no-repeat",
          paddingBottom: "20%",
        }}
      >
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center text-white leading-tight mb-8 sm:mb-12">
            The all-in-one place to find the job of your dreams
          </h1>
          <SearchBar />
        </div>
      </section>

      {/* our most popular component */}

      <div className="w-full bg-white p-4">
        <h1 className="mb-4 text-indigo-900 font-bold text-xl">
          Or start searching by clicking on of the cards!{" "}
        </h1>

        <div
          className={
            isColumn
              ? "flex flex-col space-y-4"
              : "flex justify-between items-stretch space-x-4 overflow-x-auto"
          }
        >
          {jobCategories.slice(0, visibleBlocks).map((category, index) => (
            <JobCategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default JobSearchComponent;
