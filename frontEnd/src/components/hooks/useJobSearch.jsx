import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export function useJobSearch() {
  const [jobListings, setJobListings] = useState([]);
  const [savedJobs, setSavedJobs] = useState({});
  const [expandedJob, setExpandedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [selectedLogo, setSelectedLogo] = useState("All"); // Store selected logo filter

  const location = useLocation();

  // Parse searchTerm and city from the query parameters
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("searchTerm") || "";
  const city = searchParams.get("city") || "";

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, user is not authenticated.");
        return;
      }

      console.log(
        `Fetching jobs for page ${currentPage}, searchTerm: ${searchTerm}, city: ${city}, logo: ${selectedLogo}`
      );

      try {
        // Fetch jobs with searchTerm, city, and logo
        const jobResponse = await axios.get(
          `http://localhost:4000/api/jobs?page=${currentPage}&limit=10&searchTerm=${searchTerm}&city=${city}&logo=${
            selectedLogo !== "All" ? selectedLogo : ""
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJobListings(jobResponse.data.jobs);
        setTotalPages(jobResponse.data.totalPages);
        setTotalJobs(jobResponse.data.totalJobs); // Track total jobs for UI
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchJobs();
  }, [currentPage, searchTerm, city, selectedLogo]);

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
        // Unsave job
        await axios.delete(`http://localhost:4000/api/users/favourites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { jobPostId: jobId }, // Send job ID to remove
        });
        // Update state to reflect unsave
        setSavedJobs((prev) => {
          const updated = { ...prev };
          delete updated[jobId];
          return updated;
        });
      } else {
        // Save job
        await axios.post(
          `http://localhost:4000/api/users/favourites`,
          { jobPostId: jobId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Update state to reflect save
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
    totalJobs,
    setSelectedLogo, // Expose setSelectedLogo to be used by DropdownHandler
  };
}
