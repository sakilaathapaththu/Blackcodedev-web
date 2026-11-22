'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { projectTypes } from '@/content/contact';
import { api } from '@/lib/api-client';
import type { ContactPayload } from '@/lib/types';

type Status = 'idle' | 'sending' | 'sent';

const buttonLabel: Record<Status, string> = {
  idle: 'Send Message',
  sending: 'Sending…',
  sent: 'Sent!',
};

function readPayload(form: HTMLFormElement): ContactPayload & { website: string } {
  const data = new FormData(form);
  const text = (name: string) => String(data.get(name) ?? '').trim();
  return {
    firstName: text('firstName'),
    lastName: text('lastName'),
    email: text('email'),
    phone: text('phone'),
    company: text('company'),
    projectType: text('projectType'),
    message: text('message'),
    newsletter: data.get('newsletter') === 'on',
    website: text('website'), // honeypot
  };
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  // Return the button to its idle state shortly after a successful send.
  useEffect(() => {
    if (status !== 'sent') return;
    const timer = window.setTimeout(() => setStatus('idle'), 1500);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    try {
      await api.sendContact(readPayload(form));
      form.reset();
      setStatus('sent');
    } catch (err) {
      console.error('Contact form failed:', err);
      alert('Sorry, message could not be sent. Please try again.');
      setStatus('idle');
    }
  }

  return (
    <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
      <div className="form-row">
        <Field id="firstName" label="First Name" autoComplete="given-name" required />
        <Field id="lastName" label="Last Name" autoComplete="family-name" required />
      </div>

      <div className="form-row">
        <Field id="email" label="Email Address" type="email" autoComplete="email" required />
        <Field id="phone" label="Phone Number" type="tel" autoComplete="tel" />
      </div>

      <Field id="company" label="Company Name" autoComplete="organization" />

      <div className="form-group">
        <label htmlFor="projectType">Project Type</label>
        <select id="projectType" name="projectType" required defaultValue="">
          <option value="">Select Project Type</option>
          {projectTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <span className="input-focus" />
      </div>

      <div className="form-group">
        <label htmlFor="message">Project Details</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          maxLength={5000}
          placeholder="Tell us about your project requirements, goals, and any specific features you have in mind..."
          required
        />
        <span className="input-focus" />
      </div>

      {/* Honeypot for bots: hidden from people and screen readers. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input type="checkbox" id="newsletter" name="newsletter" />
          <span className="checkmark" />
          Subscribe to our newsletter for updates and insights
        </label>
      </div>

      <button type="submit" className="submit-btn" disabled={status !== 'idle'}>
        <span className="btn-text" aria-live="polite">
          {buttonLabel[status]}
        </span>
        <span className="btn-loader" />
      </button>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  required?: boolean;
  autoComplete?: string;
};

function Field({ id, label, type = 'text', required, autoComplete }: FieldProps) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input type={type} id={id} name={id} required={required} autoComplete={autoComplete} maxLength={200} />
      <span className="input-focus" />
    </div>
  );
}
