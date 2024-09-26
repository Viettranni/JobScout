import React, { useEffect } from "react";
import { JobList } from "../common/JobList";
import { Pagination } from "../common/Pagination";
import { ProfileSection } from "./ProfileSection";
import { savedJobs as initialSavedJobs } from "../../../mockData/savedJobsData"; // Import the saved jobs
import { useJobSearch } from "../../hooks/useJobSearch"; // Import the hook

export default function Cabinet() {
  // Use the useJobSearch hook with initial saved jobs
  const {
    expandedJob,
    savedJobs,
    currentPage,
    jobListings,
    setCurrentPage,
    toggleJobExpansion,
    toggleSaveJob,
  } = useJobSearch(initialSavedJobs);

  useEffect(() => {
    document.title = "Camp Locker";
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Section */}
      <ProfileSection />

      {/* Saved Jobs Header */}
      <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>

      {/* Job List Component */}
      <JobList
        jobs={jobListings}
        expandedJob={expandedJob}
        toggleJobExpansion={toggleJobExpansion}
        savedJobs={savedJobs}
        toggleSaveJob={toggleSaveJob}
      />

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={3} // Assuming 3 pages for simplicity
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
