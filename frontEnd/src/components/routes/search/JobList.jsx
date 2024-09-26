import { useState, useEffect } from "react";
import axios from 'axios';
import { JobCard } from "./JobCard";

export function JobList({ savedJobs, toggleSaveJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null); // State to track the expanded job ID

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:4000/jobPosts/getAllJobs");
        setJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch jobs: ", error);
        setError("Failed to fetch jobs");
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const toggleJobExpansion = (jobId) => {
    setExpandedJobId((prevId) => (prevId === jobId ? null : jobId)); // Expand/collapse logic
  };

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          isSaved={savedJobs[job._id]}
          toggleSave={() => toggleSaveJob(job._id)}
          isExpanded={expandedJobId === job._id} // Only one job should be expanded
          toggleExpand={() => toggleJobExpansion(job._id)} // Toggle expansion for the clicked job

        />
      ))}
    </div>
  );
}
