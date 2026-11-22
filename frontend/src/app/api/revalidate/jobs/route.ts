import { revalidateTag } from 'next/cache';
import { env } from '@/config/env';
import { JOBS_CACHE_TAG } from '@/features/careers/get-active-jobs';

/**
 * POST /api/revalidate/jobs — clears the cached careers job list so admin
 * changes appear immediately. Authorised with the same admin key as the
 * backend: the key is checked by calling an admin-only backend endpoint, so
 * no extra secret is needed in the frontend.
 */
export async function POST(request: Request) {
  const apiKey = request.headers.get('x-api-key')?.trim();
  if (!apiKey) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const check = await fetch(`${env.apiUrl}/api/jobs/all`, {
    headers: { 'x-api-key': apiKey },
    cache: 'no-store',
  }).catch(() => null);

  if (!check?.ok) {
    return Response.json({ error: 'Unauthorized' }, { status: check?.status === 401 ? 401 : 502 });
  }

  revalidateTag(JOBS_CACHE_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}
