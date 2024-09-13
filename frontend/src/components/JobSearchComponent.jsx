import React from "react";
import JobCategoryCard from "./JobCategoryCard";
import SearchBar from "./SearchBar";

const jobCategories = [
  {
    title: "Design",
    newJobs: 147,
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/7152116558450a9f689b062a8476fe7433341e321cfcd3483eb5725446986783?placeholderIfAbsent=true&apiKey=4bc34976a91d45169acbfea9a1c1cef5",
  },
  {
    title: "Technology",
    newJobs: 263,
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/650f9264855c85d2a7286e540940a86cf3ebb9ff31abed6a295f7217e39c5018?placeholderIfAbsent=true&apiKey=4bc34976a91d45169acbfea9a1c1cef5",
  },
  {
    title: "Marketing",
    newJobs: 47,
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/16934d1e7340153128cf77c6b0cfc13859fde08044997f2cb2535dde8d6eb1cb?placeholderIfAbsent=true&apiKey=4bc34976a91d45169acbfea9a1c1cef5",
  },
  {
    title: "Finance",
    newJobs: 78,
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ed7234a26e6fc1e889f8a178ed2a452b97eb0d8247026a8aa515704cf2ffd239?placeholderIfAbsent=true&apiKey=4bc34976a91d45169acbfea9a1c1cef5",
  },
  {
    title: "Find More",
    newJobs: null,
    // icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/b176bf1629c272a22503d66b6bd3129b4cae383d7122cb80e2f44d66cb168d69?placeholderIfAbsent=true&apiKey=4bc34976a91d45169acbfea9a1c1cef5",
    icon: null,
  },
];

function JobSearchComponent() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <section className="flex-grow flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-20 py-8 sm:py-12 md:py-16 lg:py-20 bg-indigo-950 rounded-b-xl">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center text-white leading-tight mb-8 sm:mb-12">
            The all-in-one place to find the job of your dreams
          </h1>
          <SearchBar />
        </div>
      </section>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 sm:px-8 md:px-16 lg:px-20 py-8 sm:py-12 -mt-5">
        {jobCategories.map((category, index) => (
          <JobCategoryCard key={index} {...category} />
        ))}
      </section>
    </main>
  );
}

export default JobSearchComponent;
