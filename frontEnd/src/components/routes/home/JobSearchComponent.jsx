import React, { useState, useEffect } from "react";
import JobCategoryCard from "./JobCategoryCard"; // Use JobCategoryCard instead of CategoryCard
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
    description: "Browse creative design roles and find your next opportunity.",
  },
  {
    icon: <CircuitBoardIcon className="w-8 h-8" />,
    title: "Technology",
    description: "Explore cutting-edge tech jobs tailored to your skills.",
  },
  {
    icon: <MessageSquareIcon className="w-8 h-8" />,
    title: "Marketing",
    description:
      "Discover exciting opportunities in marketing and communications.",
  },
  {
    icon: <BarChartIcon className="w-8 h-8" />,
    title: "Finance",
    description:
      "Find rewarding careers in the world of finance and economics.",
  },
  {
    icon: <BookOpenIcon className="w-8 h-8" />,
    title: "Education",
    description:
      "Connect with teaching and educational administration positions.",
  },
  {
    icon: <MoreHorizontalIcon className="w-8 h-8" />,
    title: "Find More",
    description: "Explore more job categories to find your perfect match.",
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
        <div className="w-full max-w-5xl">
          <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-white leading-tight mb-8 sm:mb-12">
            The all-in-one place to find the job of your dreams
          </h1>
          <SearchBar />
        </div>
      </section>

      {/* our most popular component */}

      <div className="w-full bg-white p-4">
        <h1 className="mb-4 text-indigo-900 font-bold text-xl">
          Or start searching by clicking on one of the cards!
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
