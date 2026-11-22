import { Readable } from 'node:stream';
import { hasValidSignature } from '../middleware/upload-cv.js';
import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { openCv, saveCv } from '../services/cv-storage.service.js';
import { badRequest, notFound } from '../utils/http-error.js';

/** POST /api/applications — public, multipart with a `cv` file. */
export async function submitApplication(req, res) {
  if (!req.file) throw badRequest('CV file is required');
  if (!hasValidSignature(req.file)) throw badRequest('The CV file appears to be corrupted or not a real document');

  const { jobId, fullName, email, phone, description } = req.body;
  const job = await Job.findOne({ _id: jobId, active: true }).select('title').lean();
  if (!job) throw notFound('Job');

  const cv = await saveCv(req.file);
  const application = await Application.create({
    jobId,
    position: job.title, // trust the database, not the client
    fullName,
    email,
    phone,
    description,
    cvOriginalName: req.file.originalname.slice(0, 200),
    ...cv,
  });

  res.status(201).json({ message: 'Application submitted', id: application._id });
}

/** GET /api/applications — admin. */
export async function listApplications(_req, res) {
  const apps = await Application.find({}).sort({ createdAt: -1 }).populate('jobId', 'title').lean();
  res.json(apps);
}

/** GET /api/applications/:id/cv — admin: streams the CV (works for private blobs). */
export async function downloadCv(req, res) {
  const app = await Application.findById(req.params.id).select('cvPath cvUrl cvAccess cvOriginalName').lean();
  if (!app) throw notFound('Application');

  const file = await openCv(app);
  if (!file) throw notFound('CV');

  const filename = (app.cvOriginalName || 'cv').replace(/[^\w.-]/g, '_');
  res.set({
    'Content-Type': file.blob.contentType ?? 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'private, no-store',
  });
  Readable.fromWeb(file.stream).pipe(res);
}
