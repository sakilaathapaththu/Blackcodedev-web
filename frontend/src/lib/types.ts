/** Shapes returned by the careers API (careers-api/models). */
export type Job = {
  _id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string[];
  active?: boolean;
  createdAt?: string;
};

export type JobInput = Pick<Job, 'title' | 'department' | 'location' | 'description' | 'requirements'>;

export type Application = {
  _id: string;
  jobId?: { _id: string; title?: string } | string | null;
  position?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  description?: string;
  cvOriginalName?: string;
  cvPath?: string;
  cvAccess?: 'public' | 'private';
  cvUrl?: string;
  createdAt?: string;
};

export type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  message: string;
  newsletter: boolean;
};
