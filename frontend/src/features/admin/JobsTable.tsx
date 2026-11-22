import { formatDate } from '@/lib/http';
import type { Job } from '@/lib/types';

type JobsTableProps = {
  jobs: Job[];
  onToggleActive: (job: Job) => void;
  onEdit: (job: Job) => void;
};

export function JobsTable({ jobs, onToggleActive, onEdit }: JobsTableProps) {
  if (!jobs.length) return <div className="empty">No careers found.</div>;

  return (
    <div className="admin-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Department</th>
            <th>Location</th>
            <th className="nowrap">Created</th>
            <th className="nowrap">Status</th>
            <th className="nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const isActive = job.active !== false;
            return (
              <tr key={job._id}>
                <td className="wrap">
                  <strong>{job.title}</strong>
                </td>
                <td className="nowrap">{job.department}</td>
                <td className="nowrap">{job.location}</td>
                <td className="nowrap">{formatDate(job.createdAt)}</td>
                <td className="nowrap">
                  <span className="pill">{isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="nowrap">
                  <button type="button" onClick={() => onToggleActive(job)}>
                    {isActive ? 'Disable' : 'Enable'}
                  </button>{' '}
                  <button type="button" onClick={() => onEdit(job)}>
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
