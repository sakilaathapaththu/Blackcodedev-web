import { Job } from '../models/Job.js';
import { notFound } from '../utils/http-error.js';

const PUBLIC_FIELDS = 'title department location description requirements active createdAt';

/** GET /api/jobs — public list of open roles. */
export async function listActiveJobs(_req, res) {
  const jobs = await Job.find({ active: true }).select(PUBLIC_FIELDS).sort({ createdAt: -1 }).lean();
  // The website caches this itself and revalidates on admin changes,
  // so a CDN copy here would only delay updates.
  res.set('Cache-Control', 'no-store');
  res.json(jobs);
}

/** GET /api/jobs/all — admin: every job, active or not. */
export async function listAllJobs(_req, res) {
  res.json(await Job.find({}).sort({ createdAt: -1 }).lean());
}

/** GET /api/jobs/:id — admin. */
export async function getJob(req, res) {
  const job = await Job.findById(req.params.id).lean();
  if (!job) throw notFound('Job');
  res.json(job);
}

/** POST /api/jobs and POST /api/jobs/add (legacy) — admin. */
export async function createJob(req, res) {
  const job = await Job.create(req.body);
  res.status(201).json(job);
}

/** PATCH /api/jobs/:id and PATCH /api/jobs/:id/active — admin. */
export async function updateJob(req, res) {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true },
  ).lean();
  if (!job) throw notFound('Job');
  res.json(job);
}
