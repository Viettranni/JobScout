import { useJobSearch } from "../../hooks/useJobSearch";
import { SearchBar } from "./SearchBar";
import { JobList } from "../common/JobList";
import { Pagination } from "../common/Pagination";
import { DropdownHandler } from "./DropdownHandler";
import { useLocation } from "react-router-dom";
import { dropdownData } from "../../../mockData/mockDropdownData";
import { useEffect } from "react";

export default function JobSearch() {
  useEffect(() => {
    document.title = "Job Tracks & Trails";
  }, []);

  const {
    expandedJob,
    savedJobs,
    currentPage,
    totalPages,
    totalJobs, // Get the total number of jobs from the hook
    jobListings,
    setCurrentPage,
    toggleJobExpansion,
    toggleSaveJob,
    setSelectedLogo, // Get the function to update the selected logo
  } = useJobSearch();

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  return (
    <div className="container mx-auto px-4 py-8 lg:w-4/5">
      <SearchBar />
      <div className="flex flex-wrap mb-6 gap-2">
        <div className="mr-5">
          <h2 className="text-xl font-semibold">{totalJobs} Jobs results</h2>
          <p className="text-l font-semibold">for: {query}</p>
        </div>
        {/* Pass setSelectedLogo to DropdownHandler */}
        <DropdownHandler
          dropdownData={dropdownData}
          handleLogoSelect={setSelectedLogo}
        />
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
