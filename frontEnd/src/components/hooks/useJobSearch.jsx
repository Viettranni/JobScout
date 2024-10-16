import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export function useJobSearch() {
  const [jobListings, setJobListings] = useState([]);
  const [savedJobs, setSavedJobs] = useState({});
  const [appliedJobs, setAppliedJobs] = useState({});
  const [expandedJob, setExpandedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [selectedLogo, setSelectedLogo] = useState("All");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("searchTerm") || "";
  const city = searchParams.get("city") || "";

  const url =  "http://localhost:4000";
  
  // "https://jobscout-api-f8ep.onrender.com"

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobResponse = await axios.get(
          `${url}/api/jobs?page=${currentPage}&limit=10&searchTerm=${searchTerm}&city=${city}&logo=${
            selectedLogo !== "All" ? selectedLogo : ""
          }`
        );

        setJobListings(jobResponse.data.jobs);
        setTotalPages(jobResponse.data.totalPages);
        setTotalJobs(jobResponse.data.totalJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    const fetchSavedJobs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // User is not authenticated, skip fetching saved jobs
        return;
      }

      try {
        const savedResponse = await axios.get(
          `${url}/api/users/favourites`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
            "Saved jobs response does not contain an array of favourites."
          );
        }
      } catch (error) {
        console.error("Failed to fetch saved jobs:", error);
      }
    };

    const fetchAppliedJobs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // User is not authenticated, skip fetching saved jobs
        return;
      }

      try {
        const savedResponse = await axios.get(
          `${url}/api/users/appliedJobs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (Array.isArray(savedResponse.data.appliedJobs)) {
          const appliedJobsMap = savedResponse.data.appliedJobs.reduce(
            (acc, job) => {
              acc[job._id] = true;
              return acc;
            },
            {}
          );

          setAppliedJobs(appliedJobsMap);
        } else {
          console.error(
            "Applied jobs response does not contain an array of applied jobs."
          );
        }
      } catch (error) {
        console.error("Failed to fetch applied jobs:", error);
      }
    };

    fetchJobs();
    fetchSavedJobs();
    fetchAppliedJobs();
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
        await axios.delete(`${url}/api/users/favourites`, {
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
        // Save job
        await axios.patch(
          `${url}/api/users/favourites`,
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

  const toggleAppliedJobs = async (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found, user is not authenticated.");
      return;
    }

    try {
      if (appliedJobs[jobId]) {
        // Unsave job
        await axios.delete(`${url}/api/users/appliedJobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { jobPostId: jobId },
        });

        setAppliedJobs((prev) => {
          const updated = { ...prev };
          delete updated[jobId];
          return updated;
        });
      } else {
        // Save job
        await axios.patch(
          `${url}/api/users/appliedJobs`,
          { jobPostId: jobId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAppliedJobs((prev) => ({ ...prev, [jobId]: true }));
      }
    } catch (error) {
      console.error("Failed to toggle applied job:", error);
    }
  };

  return {
    jobListings,
    savedJobs,
    appliedJobs,
    expandedJob,
    currentPage,
    setCurrentPage,
    toggleJobExpansion,
    toggleSaveJob,
    toggleAppliedJobs,
    totalPages,
    totalJobs,
    setSelectedLogo,
  };
}
