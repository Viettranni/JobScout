import { useState } from "react";
import { JobCard } from "./JobCard";

export function JobList({ jobs, savedJobs, toggleSaveJob, appliedJobs = {}, toggleAppliedJobs = () => {} }) {
  const [expandedJobId, setExpandedJobId] = useState(null);

  const toggleJobExpansion = (jobId) => {
    setExpandedJobId((prevId) => (prevId === jobId ? null : jobId));
  };

  if (!jobs || jobs.length === 0) {
    return <p>No jobs to display.</p>;
  }

  return (
    <div className="space-y-4">
      {jobs
        .filter((job) => job && job._id)
        .map((job) => (
          <JobCard
            key={job._id}
            job={job}
            isSaved={!!savedJobs[job._id]} // Check if the job is saved
            toggleSave={() => toggleSaveJob(job._id)} // Call toggleSaveJob correctly
            isApplied={!!appliedJobs[job._id]} // Check if the job is applied, fallback to empty object
            toggleApplied={() => toggleAppliedJobs(job._id)} // Safely call toggleAppliedJobs for applying/unapplying
            isExpanded={expandedJobId === job._id} // Handle expansion
            toggleExpand={() => toggleJobExpansion(job._id)} // Handle job expansion
          />
        ))}
    </div>
  );
}
