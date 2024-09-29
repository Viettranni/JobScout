import { useState, useEffect } from "react";
import axios from "axios";

export function useJobSearch() {
  const [jobListings, setJobListings] = useState([]);
  const [savedJobs, setSavedJobs] = useState({});
  const [expandedJob, setExpandedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch jobs when component mounts or page changes
  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, user is not authenticated.");
        return;
      }

      console.log(`Fetching jobs for page ${currentPage}`);

      try {
        // Fetch jobs
        const jobResponse = await axios.get(
          `http://localhost:4000/api/jobs?page=${currentPage}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJobListings(jobResponse.data.jobs);
        setTotalPages(jobResponse.data.totalPages);

        // Fetch saved jobs only once (on initial load)
        const savedResponse = await axios.get(
          `http://localhost:4000/api/users/favourites`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Debugging log for API response
        console.log("Saved Jobs API Response:", savedResponse.data);

        if (Array.isArray(savedResponse.data.favourites)) {
          const savedJobsMap = savedResponse.data.favourites.reduce(
            (acc, job) => {
              acc[job._id] = true;
              return acc;
            },
            {}
          );
          setSavedJobs(savedJobsMap);
        } else {
          console.error(
            "Saved jobs response does not contain an array of favourites:",
            savedResponse.data
          );
        }
      } catch (error) {
        console.error("Failed to fetch jobs or saved jobs:", error);
      }
    };

    fetchJobs();
  }, [currentPage]);

  const toggleJobExpansion = (jobId) => {
    setExpandedJob((prevId) => (prevId === jobId ? null : jobId));
  };

  const toggleSaveJob = async (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found, user is not authenticated.");
      return;
    }

    try {
      if (savedJobs[jobId]) {
        await axios.delete(`http://localhost:4000/api/users/favourites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { jobPostId: jobId },
        });
        setSavedJobs((prev) => {
          const updated = { ...prev };
          delete updated[jobId];
          return updated;
        });
      } else {
        await axios.post(
          `http://localhost:4000/api/users/favourites`,
          { jobPostId: jobId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSavedJobs((prev) => ({ ...prev, [jobId]: true }));
      }
    } catch (error) {
      console.error("Failed to toggle save job:", error);
    }
  };

  return {
    jobListings,
    savedJobs,
    expandedJob,
    currentPage,
    setCurrentPage,
    toggleJobExpansion,
    toggleSaveJob,
    totalPages,
  };
}
