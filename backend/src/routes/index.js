import { Router } from 'express';
import * as applications from '../controllers/applications.controller.js';
import * as contact from '../controllers/contact.controller.js';
import * as jobs from '../controllers/jobs.controller.js';
import { adminLimiter, applicationLimiter, contactLimiter } from '../middleware/rate-limit.js';
import { requireAdmin } from '../middleware/require-admin.js';
import { uploadCv } from '../middleware/upload-cv.js';
import { validate, validateObjectId } from '../middleware/validate.js';
import {
  applicationSchema,
  contactSchema,
  jobActiveSchema,
  jobCreateSchema,
  jobUpdateSchema,
} from '../validators/schemas.js';

/**
 * API routes. Paths are kept compatible with the old careers-api and
 * api/send-contact.js so existing clients keep working.
 */
export const router = Router();
const admin = [adminLimiter, requireAdmin];
const jobId = validateObjectId('id', 'Job');

router.get('/health', (_req, res) => res.json({ ok: true }));

// ---- Jobs ----
router.get('/jobs', jobs.listActiveJobs);
router.get('/jobs/all', admin, jobs.listAllJobs);
router.get('/jobs/:id', admin, jobId, jobs.getJob);
router.post('/jobs', admin, validate(jobCreateSchema), jobs.createJob);
router.post('/jobs/add', admin, validate(jobCreateSchema), jobs.createJob); // legacy path
router.patch('/jobs/:id', admin, jobId, validate(jobUpdateSchema), jobs.updateJob);
router.patch('/jobs/:id/active', admin, jobId, validate(jobActiveSchema), jobs.updateJob);

// ---- Applications ----
router.post('/applications', applicationLimiter, uploadCv, validate(applicationSchema), applications.submitApplication);
router.get('/applications', admin, applications.listApplications);
router.get(
  '/applications/:id/cv',
  admin,
  validateObjectId('id', 'Application'),
  applications.downloadCv,
);

// ---- Contact ----
router.post('/contact', contactLimiter, validate(contactSchema), contact.submitContact);
router.post('/send-contact', contactLimiter, validate(contactSchema), contact.submitContact); // legacy path
