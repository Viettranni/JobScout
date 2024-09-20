// src/hooks/useJobSearch.js

import { useState, useEffect } from "react";
import { jobListings as mockJobListings } from "../mockData"; // Import your mock data

export function useJobSearch() {
  const [expandedJob, setExpandedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [jobListings, setJobListings] = useState([]);

  // Effect to load mock data
  useEffect(() => {
    setJobListings(mockJobListings);
  }, []);

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
