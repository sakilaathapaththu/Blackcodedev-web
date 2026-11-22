'use client';

import { useState, type FormEvent } from 'react';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { linesToList } from '@/lib/http';
import type { Job, JobInput } from '@/lib/types';

type JobFormModalProps = {
  /** Existing job to edit; omit to create a new one. */
  job?: Job;
  onSubmit: (input: JobInput) => Promise<void>;
  onClose: () => void;
};

/** Shared Add / Edit career dialog. */
export function JobFormModal({ job, onSubmit, onClose }: JobFormModalProps) {
  const isEdit = Boolean(job);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEscapeKey(onClose);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? '').trim();

    setSaving(true);
    setMessage(isEdit ? 'Updating…' : 'Saving...');
    try {
      await onSubmit({
        title: text('title'),
        department: text('department'),
        location: text('location'),
        description: text('description'),
        requirements: linesToList(text('requirements')),
      });
      if (isEdit) {
        onClose();
      } else {
        form.reset();
        setMessage('Career added successfully ✅');
      }
    } catch (err) {
      console.error(err);
      setMessage(isEdit ? 'Update failed ❌' : 'Error adding career ❌');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal-panel" role="dialog" aria-modal="true" aria-labelledby="job-form-title">
        <h2 id="job-form-title">{isEdit ? 'Edit Career' : 'Add Career'}</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <input name="title" placeholder="Job Title" defaultValue={job?.title} required />
          <input name="department" placeholder="Department" defaultValue={job?.department} required />
          <input name="location" placeholder="Location" defaultValue={job?.location} required />
          <textarea name="description" placeholder="Description" defaultValue={job?.description} required />
          <textarea
            name="requirements"
            placeholder="Requirements (one per line)"
            defaultValue={job?.requirements?.join('\n')}
            required
          />
          <div className="admin-form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
        <div className="muted admin-form-message" aria-live="polite">
          {message}
        </div>
      </div>
    </div>
  );
}
