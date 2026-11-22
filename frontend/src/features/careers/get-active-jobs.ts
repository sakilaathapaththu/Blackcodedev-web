import { connection } from 'next/server';
import { env } from '@/config/env';
import { requestJson } from '@/lib/http';
import type { Job } from '@/lib/types';

/**
 * Reads the public job list on the server for every request (no caching), so
 * enabling or disabling a job in the admin shows up on the next page load.
 * Returns `null` when the API is unreachable so the page can show a message.
 */
export async function getActiveJobs(): Promise<Job[] | null> {
  // Always run at request time (never baked into the build output).
  await connection();
  try {
    const jobs = await requestJson<Job[]>(`${env.apiUrl}/api/jobs`, { cache: 'no-store' });
    return Array.isArray(jobs) ? jobs : [];
  } catch (err) {
    console.error('Failed to load jobs:', err);
    return null;
  }
}
