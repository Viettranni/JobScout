import { useState, useEffect } from "react";
import axios from "axios";

const url = process.env.REACT_APP_API_URL || "http://localhost:4000";


export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found, user is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${url}/api/users/favourites?page=${currentPage}&limit=${jobsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSavedJobs(response.data.favourites);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch saved jobs.");
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [currentPage]);

  const toggleSaveJob = async (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found, user is not authenticated.");
      return;
    }

    try {
      if (savedJobs.some((job) => job._id === jobId)) {
        // Unsave the job
        await axios.delete(`${url}/api/users/favourites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { jobPostId: jobId },
        });

        setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
      } else {
        // Save the job
        await axios.patch(
          `${url}/api/users/favourites`,
          { jobPostId: jobId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const jobResponse = await axios.get(
          `${url}/api/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSavedJobs((prev) => [...prev, jobResponse.data]);
      }
    } catch (error) {
      console.error("Failed to toggle save job:", error);
    }
  };

  return {
    savedJobs,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    toggleSaveJob, // Ensure this function is returned
  };
}
