import type { Job } from '@/lib/types';

type JobCardProps = {
  job: Job;
  index: number;
  onApply: (job: Job) => void;
};

export function JobCard({ job, index, onApply }: JobCardProps) {
  return (
    <div className="job-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <h3 className="job-title">{job.title || 'Untitled Role'}</h3>
      <div className="job-department">{job.department}</div>
      <div className="job-location">
        <span aria-hidden="true">📍</span>
        <span>{job.location}</span>
      </div>
      <p className="job-description">{job.description}</p>
      <div className="job-requirements">
        <h4>Key Requirements:</h4>
        <ul className="requirements-list">
          {(job.requirements ?? []).map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
      </div>
      <button type="button" className="apply-btn" onClick={() => onApply(job)}>
        Apply Now
      </button>
    </div>
  );
}

/** Placeholder card used for loading / empty / error states. */
export function JobsMessage({ children }: { children: string }) {
  return (
    <div className="jobs-grid">
      <div className="job-card">
        <p className="job-description">{children}</p>
      </div>
    </div>
  );
}
