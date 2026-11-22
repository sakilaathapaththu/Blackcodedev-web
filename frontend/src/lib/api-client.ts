import { env } from '@/config/env';
import { ApiError, requestJson } from '@/lib/http';
import type { Application, ContactPayload, Job, JobInput } from '@/lib/types';

/**
 * Typed client for the backend API (backend/ in this repo). This module is the
 * only place in the frontend that knows API routes.
 */
const base = () => env.apiUrl;

const adminHeaders = (apiKey: string, json = false): HeadersInit => ({
  'x-api-key': apiKey,
  ...(json ? { 'Content-Type': 'application/json' } : {}),
});

export const api = {
  listActiveJobs: () => requestJson<Job[]>(`${base()}/api/jobs`),

  submitApplication: (form: FormData) =>
    requestJson<{ message: string; id: string }>(`${base()}/api/applications`, {
      method: 'POST',
      body: form,
    }),

  sendContact: (payload: ContactPayload & { website?: string }) =>
    requestJson<{ ok: true }>(`${base()}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  admin: {
    listApplications: (apiBase: string, apiKey: string) =>
      requestJson<Application[]>(`${apiBase}/api/applications`, { headers: adminHeaders(apiKey) }),

    /** Downloads a CV through the authenticated endpoint (works for private files). */
    downloadCv: async (apiBase: string, apiKey: string, applicationId: string): Promise<Blob> => {
      const res = await fetch(`${apiBase}/api/applications/${encodeURIComponent(applicationId)}/cv`, {
        headers: adminHeaders(apiKey),
      });
      if (!res.ok) throw new ApiError(`Download failed (${res.status})`, res.status);
      return res.blob();
    },

    listJobs: (apiBase: string, apiKey: string) =>
      requestJson<Job[]>(`${apiBase}/api/jobs/all`, { headers: adminHeaders(apiKey) }),

    createJob: (apiBase: string, apiKey: string, job: JobInput) =>
      requestJson<Job>(`${apiBase}/api/jobs`, {
        method: 'POST',
        headers: adminHeaders(apiKey, true),
        body: JSON.stringify(job),
      }),

    updateJob: (apiBase: string, apiKey: string, id: string, job: Partial<JobInput>) =>
      requestJson<Job>(`${apiBase}/api/jobs/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: adminHeaders(apiKey, true),
        body: JSON.stringify(job),
      }),

    /** Tells this website to drop its cached job list (same-origin route). */
    revalidateJobs: (apiKey: string) =>
      requestJson<{ revalidated: boolean }>('/api/revalidate/jobs', {
        method: 'POST',
        headers: adminHeaders(apiKey),
      }),

    setJobActive: (apiBase: string, apiKey: string, id: string, active: boolean) =>
      requestJson<Job>(`${apiBase}/api/jobs/${encodeURIComponent(id)}/active`, {
        method: 'PATCH',
        headers: adminHeaders(apiKey, true),
        body: JSON.stringify({ active }),
      }),
  },
};
