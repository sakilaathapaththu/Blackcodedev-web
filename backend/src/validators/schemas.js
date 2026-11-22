import { z } from 'zod';

const text = (max, label) =>
  z
    .string({ error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} is too long`);

/** Accepts an array or a newline/comma separated string (admin form). */
const requirements = z
  .union([z.array(z.string()), z.string()])
  .transform((value) =>
    (Array.isArray(value) ? value : value.split(/\r?\n|,/)).map((s) => s.trim()).filter(Boolean),
  )
  .pipe(z.array(z.string().max(500)).min(1, 'At least one requirement is required').max(50));

export const jobCreateSchema = z.object({
  title: text(150, 'Title'),
  department: text(100, 'Department'),
  location: text(150, 'Location'),
  description: text(5000, 'Description'),
  requirements,
  active: z.boolean().optional().default(true),
});

export const jobUpdateSchema = jobCreateSchema
  .partial()
  .extend({ active: z.boolean().optional() })
  .refine((obj) => Object.keys(obj).length > 0, 'Nothing to update');

export const jobActiveSchema = z.object({
  active: z.boolean({ error: 'active must be boolean' }),
});

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid job');

export const applicationSchema = z.object({
  jobId: objectId,
  fullName: text(120, 'Full name'),
  email: z.string({ error: 'Email is required' }).trim().toLowerCase().email('Invalid email address').max(200),
  phone: z
    .string({ error: 'Phone number is required' })
    .trim()
    .regex(/^[+()\d\s-]{7,20}$/, 'Invalid phone number'),
  description: text(3000, 'Description'),
});

export const contactSchema = z.object({
  firstName: text(100, 'First name'),
  lastName: text(100, 'Last name'),
  email: z.string({ error: 'Email is required' }).trim().email('Invalid email address').max(200),
  phone: z.string().trim().max(30).optional().default(''),
  company: z.string().trim().max(150).optional().default(''),
  projectType: text(50, 'Project type'),
  message: text(5000, 'Message'),
  newsletter: z.coerce.boolean().optional().default(false),
  /** Honeypot: real users never fill this hidden field. */
  website: z.string().max(500).optional(),
});
