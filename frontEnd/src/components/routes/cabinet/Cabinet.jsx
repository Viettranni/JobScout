import React, { useEffect } from "react";
import { JobList } from "../common/JobList";
import { Pagination } from "../common/Pagination";
import { ProfileSection } from "./ProfileSection";
import { useSavedJobs } from "../../hooks/useSavedJobs"; // Hook to fetch saved jobs
import ScrollToTop from "../common/ScrollToTop";
import EmptyState from "./EmptyState";

export default function Cabinet() {
  const {
    savedJobs,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    toggleSaveJob,
  } = useSavedJobs();

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

      {/* Conditionally render the EmptyState if no saved jobs */}
      {savedJobs.length === 0 ? (
        <EmptyState
          title="Your Cabinet is Empty"
          message="You haven't saved any jobs yet. Start browsing jobs and save the ones that catch your interest!"
          actionText="Browse Jobs"
          onAction={() => (window.location.href = "/jobs")} // Redirect to job listings page
        />
      ) : (
        <>
          {/* Saved Jobs Header */}
          <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>

          {/* Job List Component */}
          <JobList
            jobs={savedJobs || []}
            savedJobs={(savedJobs || []).reduce(
              (acc, job) => ({ ...acc, [job._id]: true }),
              {}
            )}
            toggleSaveJob={toggleSaveJob}
          />

          {/* Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
