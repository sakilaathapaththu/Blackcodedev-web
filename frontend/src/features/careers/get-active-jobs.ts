import { cacheLife } from 'next/cache';
import { api } from '@/lib/api-client';
import type { Job } from '@/lib/types';

/**
 * Server-side, cached read of the public job list. Rendering jobs on the
 * server makes them indexable and avoids a client-side loading spinner.
 * Returns `null` when the API is unreachable so the page can show a message.
 */
export async function getActiveJobs(): Promise<Job[] | null> {
  'use cache';

  try {
    const jobs = await api.listActiveJobs();
    cacheLife('minutes');
    return Array.isArray(jobs) ? jobs : [];
  } catch (err) {
    // Cache failures only briefly so a temporary API outage heals quickly.
    console.error('Failed to load jobs:', err);
    cacheLife('seconds');
    return null;
  }
}
