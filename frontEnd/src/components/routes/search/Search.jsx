import { useJobSearch } from "./useJobSearch"; // Import your custom hook
import { SearchBar } from "./SearchBar";
import { JobList } from "./JobList";
import { Pagination } from "./Pagination";
import { DropdownHandler } from "./DropdownHandler";
import { useLocation } from "react-router-dom";
import { dropdownData } from "../mockDropdownData";

export default function JobSearch() {
  const {
    expandedJob,
    savedJobs,
    currentPage,
    jobListings,
    setCurrentPage,
    toggleJobExpansion,
    toggleSaveJob,
  } = useJobSearch(); // Use the custom hook

  const location = useLocation();
  const totalPages = 3; // Assuming we have 3 pages
  const query = new URLSearchParams(location.search).get("q") || "";

  return (
    <div className="container mx-auto px-4 py-8 lg:w-4/5">
     <SearchBar />
      <div className="flex flex-wrap mb-6 gap-2">

        <div className="mr-5">
          <h2 className="text-xl font-semibold">
            {jobListings.length} Jobs results
          </h2>
          <p className="text-l font-semibold">for: "{query}"</p>
        </div>
        <DropdownHandler dropdownData={dropdownData} />

 
      </div>


      <JobList
        jobs={jobListings}
        expandedJob={expandedJob}
        toggleJobExpansion={toggleJobExpansion}
        savedJobs={savedJobs}
        toggleSaveJob={toggleSaveJob}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
