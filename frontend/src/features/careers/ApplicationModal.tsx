'use client';

import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { api } from '@/lib/api-client';
import type { Job } from '@/lib/types';

const MAX_CV_BYTES = 10 * 1024 * 1024; // must match careers-api multer limit
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

function validateCv(file: File | undefined): string | null {
  if (!file) return 'Please attach your CV/Resume.';
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) return 'Only PDF, DOC or DOCX files are allowed.';
  if (file.size > MAX_CV_BYTES) return 'CV must be 10 MB or smaller.';
  return null;
}

type ApplicationModalProps = {
  job: Job;
  onClose: () => void;
};

export function ApplicationModal({ job, onClose }: ApplicationModalProps) {
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useLockBodyScroll(true);
  useEscapeKey(onClose);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? `Selected: ${file.name}` : '');
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cv = formData.get('cv');

    const cvError = validateCv(cv instanceof File && cv.size > 0 ? cv : undefined);
    if (cvError) {
      alert(cvError);
      return;
    }

    setSubmitting(true);
    try {
      await api.submitApplication(formData);
      alert(
        `Thank you ${formData.get('fullName')}! Your application for ${job.title} has been submitted successfully.`,
      );
      onClose();
    } catch (err) {
      console.error('Application submit failed:', err);
      alert(`Error: ${err instanceof Error ? err.message : 'Submission failed.'}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      style={{ display: 'block' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalJobTitle">
        <div className="modal-header">
          <h2 className="modal-title" id="modalJobTitle">
            {job.title ? `Apply for ${job.title}` : 'Apply for Position'}
          </h2>
          <button type="button" className="close-btn" aria-label="Close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="hidden" name="jobId" value={job._id} />
          <input type="hidden" name="position" value={job.title} />

          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input type="text" id="fullName" name="fullName" autoComplete="name" maxLength={120} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input type="email" id="email" name="email" autoComplete="email" maxLength={200} required />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Contact Number *</label>
            <input type="tel" id="phone" name="phone" autoComplete="tel" maxLength={30} required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Why are you interested in this position? *</label>
            <textarea
              id="description"
              name="description"
              maxLength={3000}
              placeholder="Tell us about your interest in this role and what makes you a great fit..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cv">Upload CV/Resume *</label>
            <div className="file-upload">
              <input
                type="file"
                id="cv"
                name="cv"
                accept={ALLOWED_EXTENSIONS.join(',')}
                required
                onChange={handleFileChange}
              />
              <div className="file-upload-label">
                <span aria-hidden="true">📄</span>
                <span>Click to upload your CV/Resume</span>
              </div>
              <div className="file-name" style={fileName ? { color: 'rgba(255, 255, 255, 0.9)' } : undefined}>
                {fileName}
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
