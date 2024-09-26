import { JobCard } from "./JobCard";

export function JobList({
  jobs,
  expandedJob,
  toggleJobExpansion,
  savedJobs,
  toggleSaveJob,
}) {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isSaved={savedJobs[job.id]}
          toggleSave={() => toggleSaveJob(job.id)}
          isExpanded={expandedJob === job.id}
          toggleExpand={() => toggleJobExpansion(job.id)}
        />
      ))}
    </div>
  );
}
