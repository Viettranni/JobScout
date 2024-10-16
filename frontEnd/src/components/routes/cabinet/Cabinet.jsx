import React, { useEffect } from "react";
import { JobList } from "../common/JobList";
import { Pagination } from "../common/Pagination";
import { ProfileSection } from "./ProfileSection";
import { useSavedJobs } from "../../hooks/useSavedJobs"; // Hook to fetch saved jobs 
import { useAppliedJobs } from "../../hooks/useAppliedJobs"; // Hook to fetch applied jobs
import ScrollToTop from "../common/ScrollToTop";
import EmptyState from "./EmptyState";
import Loading from "../common/Loading";

export default function Cabinet() {
  const {
    savedJobs,
    loading: loadingSaved,
    error: errorSaved,
    currentPage,
    totalPages,
    setCurrentPage,
    toggleSaveJob,
  } = useSavedJobs();

  const {
    appliedJobs,
    loading: loadingApplied,
    error: errorApplied,
    currentPage: currentPageApplied,
    totalPages: totalPagesApplied,
    setCurrentPage: setCurrentPageApplied,
    toggleAppliedJob,
  } = useAppliedJobs();

  useEffect(() => {
    document.title = "Camp Locker";
  }, []);

  // Handle loading state for saved jobs
  if (loadingSaved) {
    return <Loading message="Loading saved jobs..." />;
  }

  // Handle error state for saved jobs
  if (errorSaved) {
    return <p>{errorSaved}</p>;
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

      {/* Handle loading state for applied jobs */}
      {loadingApplied ? (
        <Loading message="Loading applied jobs..." />
      ) : errorApplied ? (
        <p>{errorApplied}</p>
      ) : appliedJobs.length === 0 ? (
        <EmptyState
          title="No Applied Jobs"
          message="You haven't applied for any jobs yet. Start applying and keep track of your progress here!"
          actionText="Browse Jobs"
          onAction={() => (window.location.href = "/jobs")} // Redirect to job listings page
        />
      ) : (
        <>
          {/* Applied Jobs Header */}
          <h2 className="text-2xl font-bold mt-8 mb-4">Applied Jobs</h2>

          {/* Job List Component for Applied Jobs */}
          <JobList
            jobs={appliedJobs || []}
            appliedJobs={(appliedJobs || []).reduce(
              (acc, job) => ({ ...acc, [job._id]: true }),
              {}
            )}
            toggleAppliedJob={toggleAppliedJob} // Handle applying and unapplying
          />

          {/* Pagination Component for applied jobs */}
          <Pagination
            currentPage={currentPageApplied}
            totalPages={totalPagesApplied}
            setCurrentPage={setCurrentPageApplied}
          />
        </>
      )}
    </div>
  );
}
