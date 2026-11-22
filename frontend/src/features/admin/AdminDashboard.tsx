'use client';

import { useMemo, useState } from 'react';
import { env, normalizeBaseUrl } from '@/config/env';
import { api } from '@/lib/api-client';
import type { Application, Job, JobInput } from '@/lib/types';
import { ApplicationsTable, filterApplications } from './ApplicationsTable';
import { JobFormModal } from './JobFormModal';
import { JobsTable } from './JobsTable';

/** State of a server request: lets the UI render every case explicitly. */
type Remote<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: T };

type Dialog = { mode: 'add' } | { mode: 'edit'; job: Job } | null;

/**
 * Admin console for the careers API. The API key is kept in memory only
 * (never persisted) and sent as the `x-api-key` header on each request.
 */
export function AdminDashboard() {
  const [apiBase, setApiBase] = useState<string>(env.apiUrl);
  const [apiKey, setApiKey] = useState('');
  const [query, setQuery] = useState('');
  const [apps, setApps] = useState<Remote<Application[]>>({ status: 'idle' });
  const [jobs, setJobs] = useState<Remote<Job[]>>({ status: 'idle' });
  const [dialog, setDialog] = useState<Dialog>(null);

  const base = normalizeBaseUrl(apiBase) || env.apiUrl;
  const key = apiKey.trim();

  const filteredApps = useMemo(
    () => (apps.status === 'ready' ? filterApplications(apps.data, query) : []),
    [apps, query],
  );

  async function loadApplications() {
    if (!key) {
      alert('Please enter your admin x-api-key.');
      return;
    }
    setApps({ status: 'loading' });
    try {
      const data = await api.admin.listApplications(base, key);
      setApps({ status: 'ready', data: Array.isArray(data) ? data : [] });
    } catch (err) {
      console.error(err);
      setApps({ status: 'error', message: 'Could not load applications. Check API base and key.' });
    }
  }

  async function downloadCv(app: Application) {
    try {
      const file = await api.admin.downloadCv(base, key, app._id);
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = app.cvOriginalName || 'cv';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error(err);
      alert('Could not download CV.');
    }
  }

  async function loadJobs() {
    if (!key) {
      setJobs({ status: 'error', message: 'Enter your admin x-api-key, then click "View Careers".' });
      return;
    }
    setJobs({ status: 'loading' });
    try {
      const data = await api.admin.listJobs(base, key);
      setJobs({ status: 'ready', data: Array.isArray(data) ? data : [] });
    } catch (err) {
      console.error(err);
      setJobs({ status: 'error', message: 'Could not load careers.' });
    }
  }

  /** Make the public careers page show the change right away. */
  async function refreshPublicCareers() {
    try {
      await api.admin.revalidateJobs(key);
    } catch (err) {
      // Not fatal: the page also refreshes on its own within a few minutes.
      console.warn('Could not refresh careers page cache:', err);
    }
  }

  /** Refresh the careers list only if it is currently shown. */
  function refreshJobsIfVisible() {
    if (jobs.status === 'ready') void loadJobs();
  }

  async function toggleActive(job: Job) {
    if (!key) {
      alert('Enter your admin x-api-key to change status.');
      return;
    }
    try {
      await api.admin.setJobActive(base, key, job._id, job.active === false);
      await Promise.all([loadJobs(), refreshPublicCareers()]);
    } catch (err) {
      console.error(err);
      alert('Could not update status.');
    }
  }

  async function saveJob(input: JobInput) {
    if (!key) throw new Error('Missing admin x-api-key.');
    if (dialog?.mode === 'edit') {
      await api.admin.updateJob(base, key, dialog.job._id, input);
    } else {
      await api.admin.createJob(base, key, input);
    }
    refreshJobsIfVisible();
    void refreshPublicCareers();
  }

  return (
    <div className="page-admin">
      <h1>Applications</h1>
      <div className="muted">Admin view of job applications. Use the API key to load data and download CVs.</div>

      <div className="bar">
        <input
          type="text"
          aria-label="API base URL"
          placeholder="API Base (e.g. http://localhost:4000)"
          value={apiBase}
          onChange={(e) => setApiBase(e.target.value)}
          style={{ minWidth: 280 }}
        />
        <input
          type="password"
          aria-label="Admin API key"
          placeholder="x-api-key (admin)"
          autoComplete="off"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ minWidth: 240 }}
        />
        <input
          type="search"
          aria-label="Search applications"
          placeholder="Search name/email/position…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ minWidth: 260 }}
        />
        <button type="button" onClick={loadApplications}>
          Load
        </button>
        <button type="button" onClick={() => setDialog({ mode: 'add' })}>
          Add Career
        </button>
        <button type="button" onClick={loadJobs}>
          View Careers
        </button>
      </div>

      <section aria-label="Applications">
        {apps.status === 'loading' && <div className="empty">Loading…</div>}
        {apps.status === 'error' && <div className="empty">{apps.message}</div>}
        {apps.status === 'ready' && <ApplicationsTable apps={filteredApps} onDownloadCv={downloadCv} />}
      </section>

      <section aria-label="Careers" style={{ marginTop: 16 }}>
        {jobs.status === 'loading' && <div className="empty">Loading careers…</div>}
        {jobs.status === 'error' && <div className="empty">{jobs.message}</div>}
        {jobs.status === 'ready' && (
          <JobsTable jobs={jobs.data} onToggleActive={toggleActive} onEdit={(job) => setDialog({ mode: 'edit', job })} />
        )}
      </section>

      {dialog && (
        <JobFormModal
          key={dialog.mode === 'edit' ? dialog.job._id : 'new'}
          job={dialog.mode === 'edit' ? dialog.job : undefined}
          onSubmit={saveJob}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
