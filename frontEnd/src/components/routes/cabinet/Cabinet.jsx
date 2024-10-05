import React, { useEffect } from "react";
import { JobList } from "../common/JobList";
import { Pagination } from "../common/Pagination";
import { ProfileSection } from "./ProfileSection";
import { useSavedJobs } from "../../hooks/useSavedJobs"; // Hook to fetch saved jobs
import ScrollToTop from "../common/ScrollToTop";

export default function Cabinet() {
  const {
    savedJobs,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    toggleSaveJob, // Make sure this function is available in the hook
  } = useSavedJobs(); // Ensure toggleSaveJob is returned from the hook

  useEffect(() => {
    document.title = "Camp Locker";
  }, []);

  if (loading) {
    return <p>Loading saved jobs...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:w-4/5">
      <ScrollToTop trigger={currentPage} />
      {/* Profile Section */}
      <ProfileSection />

      {/* Saved Jobs Header */}
      <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>

      {/* Job List Component */}
      <JobList
        jobs={savedJobs || []} // Pass the saved jobs to JobList
        savedJobs={(savedJobs || []).reduce(
          (acc, job) => ({ ...acc, [job._id]: true }),
          {}
        )} // Create a map of saved jobs
        toggleSaveJob={toggleSaveJob} // Ensure this function is passed
      />

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage} // Pass current page state
        totalPages={totalPages} // Pass total pages calculated from the hook
        setCurrentPage={setCurrentPage} // Set the current page
      />
    </div>
  );
}
