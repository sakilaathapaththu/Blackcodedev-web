'use client';

import { useCallback, useState } from 'react';
import type { Job } from '@/lib/types';
import { ApplicationModal } from './ApplicationModal';
import { JobCard } from './JobCard';

/** Interactive part of the careers page: job grid + apply modal state. */
export function JobBoard({ jobs }: { jobs: Job[] }) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const close = useCallback(() => setSelectedJob(null), []);

  return (
    <>
      <div className="jobs-grid">
        {jobs.map((job, index) => (
          <JobCard key={job._id} job={job} index={index} onApply={setSelectedJob} />
        ))}
      </div>

      {/* Keyed by job so the form resets whenever a different role is opened. */}
      {selectedJob && <ApplicationModal key={selectedJob._id} job={selectedJob} onClose={close} />}
    </>
  );
}
