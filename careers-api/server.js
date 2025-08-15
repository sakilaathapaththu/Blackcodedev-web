// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');

// const Job = require('./models/Job');
// const Application = require('./models/Application');

// const app = express();
// app.use(cors()); // tighten origins in production
// app.use(express.json());

// // static serving of uploaded CVs if needed (optional)
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ---- MongoDB ----
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => {
//     console.error('Mongo connect error:', err);
//     process.exit(1);
//   });

// // ---- Multer (CV upload) ----
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
// //   filename: (req, file, cb) => {
// //     // e.g. 1699999999999_fullname_cv.pdf
// //     const safeBase = file.originalname.replace(/[^\w.-]/g, '_');
// //     cb(null, `${Date.now()}_${safeBase}`);
// //   }
// // });

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
//   fileFilter: (req, file, cb) => {
//     const ok = ['.pdf', '.doc', '.docx'].includes(
//       path.extname(file.originalname).toLowerCase()
//     );
//     cb(ok ? null : new Error('Only PDF/DOC/DOCX allowed'), ok);
//   }
// });

// // ---- Routes ----

// // Public: list active jobs
// app.get('/api/jobs', async (req, res) => {
//   const jobs = await Job.find({ active: true }).sort({ createdAt: -1 });
//   res.json(jobs);
// });

// // Admin: create a job (simple API key header)
// app.post('/api/jobs/add', async (req, res) => {
//   const key = req.header('x-api-key');
//   if (key !== process.env.ADMIN_API_KEY) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const { title, department, location, description, requirements, active } = req.body;

//   if (!title || !department || !location || !description || !Array.isArray(requirements)) {
//     return res.status(400).json({ error: 'Missing or invalid fields' });
//   }

//   const job = await Job.create({
//     title,
//     department,
//     location,
//     description,
//     requirements,
//     active: active !== false
//   });

//   res.status(201).json(job);
// });

// // Public: submit an application (multipart with CV)
// app.post('/api/applications', upload.single('cv'), async (req, res) => {
//   try {
//     const { jobId, position, fullName, email, phone, description } = req.body;
//     if (!req.file) return res.status(400).json({ error: 'CV file is required' });

//     const job = await Job.findById(jobId);
//     if (!job) return res.status(404).json({ error: 'Job not found' });

//     // safe filename
//     const safeBase = req.file.originalname.replace(/[^\w.-]/g, '_');
//     const key = `cvs/${Date.now()}_${safeBase}`;

//     // upload file buffer to Vercel Blob
//     // needs env: BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN
//     const blob = await put(key, req.file.buffer, {
//       access: 'public',
//       contentType: req.file.mimetype || 'application/octet-stream',
//     });

//     const appDoc = await Application.create({
//       jobId,
//       position,
//       fullName,
//       email,
//       phone,
//       description,
//       cvOriginalName: req.file.originalname,
//       cvUrl: blob.url, // public HTTPS URL
//     });

//     res.status(201).json({ message: 'Application submitted', id: appDoc._id });
//   } catch (e) {
//     console.error('applications error:', e);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
// // -------- Admin: list all applications (secure with x-api-key) --------
// const ADMIN_KEY = (process.env.ADMIN_API_KEY || '').trim();
// app.get('/api/applications', async (req, res) => {
//   const key = (req.header('x-api-key') || '').trim();
//   if (key !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });

//   const apps = await Application.find({})
//     .sort({ createdAt: -1 })
//     .populate('jobId', 'title');

//   res.json(apps);
// });

// // ---- export for Vercel serverless; run normally when local ----
// const port = process.env.PORT || 4000;
// if (require.main === module) {
//   app.listen(port, () => console.log(`API listening on :${port}`));
// } else {
//   module.exports = app; // Vercel uses the exported handler
// }
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { put } = require('@vercel/blob'); // <-- IMPORTANT

const Job = require('./models/Job');
const Application = require('./models/Application');

const app = express();
app.use(cors());
app.use(express.json());

// Optional health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ---- MongoDB ----
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Mongo connect error:', err);
    process.exit(1);
  });

// ---- Multer (memory storage for serverless) ----
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ok = ['.pdf', '.doc', '.docx'].includes(
      path.extname(file.originalname).toLowerCase()
    );
    cb(ok ? null : new Error('Only PDF/DOC/DOCX allowed'), ok);
  }
});

// ---- Routes ----

// Public: list active jobs
app.get('/api/jobs', async (req, res) => {
  const jobs = await Job.find({ active: true }).sort({ createdAt: -1 });
  res.json(jobs);
});

// Admin: create a job (simple API key header)
app.post('/api/jobs/add', async (req, res) => {
  try {
    const key = req.header('x-api-key');
    if (key !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, department, location, description, requirements, active } = req.body;
    if (!title || !department || !location || !description || !Array.isArray(requirements)) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    const job = await Job.create({
      title,
      department,
      location,
      description,
      requirements,
      active: active !== false
    });

    res.status(201).json(job);
  } catch (e) {
    console.error('jobs/add error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Public: submit an application (multipart with CV)
app.post('/api/applications', upload.single('cv'), async (req, res) => {
  try {
    const { jobId, position, fullName, email, phone, description } = req.body;

    if (!req.file) return res.status(400).json({ error: 'CV file is required' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Safe filename + blob key
    const safeBase = req.file.originalname.replace(/[^\w.-]/g, '_');
    const key = `cvs/${Date.now()}_${safeBase}`;

    // Upload to Vercel Blob (token must be set in env)
    const blob = await put(key, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype || 'application/octet-stream',
      token: process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN, // <-- IMPORTANT
    });

    const appDoc = await Application.create({
      jobId,
      position,
      fullName,
      email,
      phone,
      description,
      cvOriginalName: req.file.originalname,
      cvUrl: blob.url,
    });

    res.status(201).json({ message: 'Application submitted', id: appDoc._id });
  } catch (e) {
    console.error('applications error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: list all applications (secure with x-api-key)
const ADMIN_KEY = (process.env.ADMIN_API_KEY || '').trim();
app.get('/api/applications', async (req, res) => {
  const key = (req.header('x-api-key') || '').trim();
  if (key !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });

  const apps = await Application.find({})
    .sort({ createdAt: -1 })
    .populate('jobId', 'title');

  res.json(apps);
});

// Serverless export for Vercel; normal listen for local dev
const port = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(port, () => console.log(`API listening on :${port}`));
} else {
  module.exports = app;
}
