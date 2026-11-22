import { formatDate } from '@/lib/http';
import type { Application } from '@/lib/types';

function jobTitle(app: Application): string {
  if (app.jobId && typeof app.jobId === 'object' && app.jobId.title) return app.jobId.title;
  return app.position || '—';
}

function jobIdText(app: Application): string {
  if (!app.jobId) return '';
  return typeof app.jobId === 'object' ? app.jobId._id : app.jobId;
}

/** Case-insensitive search across applicant and job fields. */
export function filterApplications(apps: Application[], query: string): Application[] {
  const q = query.trim().toLowerCase();
  if (!q) return apps;
  return apps.filter((a) =>
    [a.fullName, a.email, a.phone, a.description, jobTitle(a)]
      .map((x) => (x || '').toLowerCase())
      .join(' ')
      .includes(q),
  );
}

type ApplicationsTableProps = {
  apps: Application[];
  /** Downloads the CV through the authenticated API endpoint. */
  onDownloadCv: (app: Application) => void;
};

export function ApplicationsTable({ apps, onDownloadCv }: ApplicationsTableProps) {
  if (!apps.length) return <div className="empty">No applications found.</div>;

  return (
    <div className="admin-table-wrap">
      <table>
        <thead>
          <tr>
            <th className="nowrap">Submitted</th>
            <th>Position</th>
            <th>Applicant</th>
            <th>Message</th>
            <th>CV</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((a) => {
            return (
              <tr key={a._id}>
                <td className="nowrap">{formatDate(a.createdAt)}</td>
                <td className="wrap">
                  <div>
                    <strong>{jobTitle(a)}</strong>
                  </div>
                  <div className="muted">{jobIdText(a)}</div>
                </td>
                <td className="wrap">
                  <div>
                    <span className="pill">{a.fullName}</span>
                  </div>
                  <div className="muted">
                    {a.email && <a href={`mailto:${a.email}`}>{a.email}</a>}
                    {a.phone && `${a.email ? ' · ' : ''}${a.phone}`}
                  </div>
                </td>
                <td className="wrap">{a.description}</td>
                <td className="nowrap">
                  {a.cvPath || a.cvUrl ? (
                    <button type="button" className="link-button" onClick={() => onDownloadCv(a)}>
                      Download CV
                    </button>
                  ) : (
                    <span className="muted">No file</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
