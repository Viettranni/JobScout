import { useState, useEffect } from "react";
import axios from "axios";

const url = "http://localhost:4000"; 

export function useAppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loadingApplied, setLoadingApplied] = useState(true);   // Unique loading state for applied jobs
  const [errorApplied, setErrorApplied] = useState(null);       // Unique error state for applied jobs
  const [currentPageApplied, setCurrentPageApplied] = useState(1);   // Unique pagination for applied jobs
  const [totalPagesApplied, setTotalPagesApplied] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorApplied("No token found, user is not authenticated.");
        setLoadingApplied(false);
        return;
      }

      try {
        const response = await axios.get(
          `${url}/api/users/applied?page=${currentPageApplied}&limit=${jobsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAppliedJobs(response.data.appliedJobs);
        setTotalPagesApplied(response.data.totalPages);
        setLoadingApplied(false);
      } catch (error) {
        setErrorApplied("Failed to fetch applied jobs.");
        setLoadingApplied(false);
      }
    };

    fetchAppliedJobs();
  }, [currentPageApplied]);

  const toggleAppliedJobs = async (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found, user is not authenticated.");
      return;
    }

    try {
      if (appliedJobs.some((job) => job._id === jobId)) {
        // Unapply the job (delete from applied jobs)
        await axios.delete(`${url}/api/users/appliedJobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { jobPostId: jobId },
        });

        setAppliedJobs((prev) => prev.filter((job) => job._id !== jobId));
      } else {
        // Apply for the job
        await axios.patch(
          `${url}/api/users/appliedJobs`,
          { jobPostId: jobId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const jobResponse = await axios.get(`${url}/api/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAppliedJobs((prev) => [...prev, jobResponse.data]);
      }
    } catch (error) {
      console.error("Failed to toggle applied job:", error);
    }
  };

  return {
    appliedJobs,
    loadingApplied,
    errorApplied,
    currentPageApplied,
    totalPagesApplied,
    setCurrentPageApplied,
    toggleAppliedJobs,
  };
}
