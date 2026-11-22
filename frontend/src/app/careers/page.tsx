import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { getActiveJobs } from '@/features/careers/get-active-jobs';
import { JobBoard } from '@/features/careers/JobBoard';
import { JobsMessage } from '@/features/careers/JobCard';
import '@/styles/pages/careers.css';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Join BlackCode Devs. Explore open roles across web, mobile, cloud and AI and apply online with your CV.',
  alternates: { canonical: '/careers' },
};

async function Jobs() {
  const jobs = await getActiveJobs();
  if (jobs === null) return <JobsMessage>Could not load jobs. Please refresh.</JobsMessage>;
  if (jobs.length === 0) return <JobsMessage>No openings right now. Please check back soon.</JobsMessage>;
  return <JobBoard jobs={jobs} />;
}

export default function CareersPage() {
  return (
    <PageShell scope="careers" particles={{ count: 50, variant: 'rise' }}>
      <main>
        <div className="page-header">
          <h1>Build the Future with BlackCode Devs</h1>
          <p>
            Join a fast‑moving team building real‑world products across web, mobile, cloud, and AI. Ship, learn,
            and grow with us.
          </p>
        </div>

        <Suspense fallback={<JobsMessage>Loading openings…</JobsMessage>}>
          <Jobs />
        </Suspense>
      </main>
    </PageShell>
  );
}
