import { cacheLife, cacheTag } from 'next/cache';
import { api } from '@/lib/api-client';
import type { Job } from '@/lib/types';

/** Cache tag for the public job list; revalidated when an admin edits jobs. */
export const JOBS_CACHE_TAG = 'jobs';

/**
 * Server-side, cached read of the public job list. Rendering jobs on the
 * server makes them indexable and avoids a client-side loading spinner.
 * Returns `null` when the API is unreachable so the page can show a message.
 */
export async function getActiveJobs(): Promise<Job[] | null> {
  'use cache';
  cacheTag(JOBS_CACHE_TAG);

  try {
    const jobs = await api.listActiveJobs();
    // stale: how long a browser may reuse the page without asking the server
    // (30 s is the minimum that still allows prerendering). Admin changes
    // also clear the server cache instantly via /api/revalidate/jobs.
    cacheLife({ stale: 30, revalidate: 60, expire: 3600 });
    return Array.isArray(jobs) ? jobs : [];
  } catch (err) {
    // Cache failures only briefly so a temporary API outage heals quickly.
    console.error('Failed to load jobs:', err);
    cacheLife('seconds');
    return null;
  }
}
