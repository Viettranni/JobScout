// src/hooks/useJobSearch.js

import { useState, useEffect } from "react";
import { jobListings as mockJobListings } from "../../mockData/mockData"; // Mock data for job listings

export function useJobSearch(initialJobListings = []) {
  const [expandedJob, setExpandedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [jobListings, setJobListings] = useState(initialJobListings);

  // Effect to load job listings, either mock data or passed-in data
  useEffect(() => {
    if (initialJobListings.length > 0) {
      setJobListings(initialJobListings); // Use initial listings if provided
    } else {
      setJobListings(mockJobListings); // Fallback to mock data if no initial listings
    }
  }, [initialJobListings]);

  // Toggle job expansion
  const toggleJobExpansion = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  // Toggle job save status
  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  return {
    expandedJob,
    savedJobs,
    currentPage,
    jobListings,
    setCurrentPage,
    toggleJobExpansion,
    toggleSaveJob,
  };
}
