import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { HttpError } from '../utils/http-error.js';
import { escapeHtml } from '../utils/escape-html.js';

let transporter = null;

function getTransporter() {
  if (!env.mailEnabled) throw new HttpError(503, 'Contact form is not configured');
  transporter ??= nodemailer.createTransport({
    service: 'gmail',
    auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD },
  });
  return transporter;
}

/** Removes CR/LF so user input can never inject extra email headers. */
const oneLine = (value) => String(value).replace(/[\r\n]+/g, ' ').trim();

/** Sends a contact-form enquiry to the company inbox. All input is escaped. */
export async function sendContactEmail(data) {
  const name = oneLine(`${data.firstName} ${data.lastName}`);
  const subject = `New Project Inquiry — ${name}`;
  const rows = [
    ['Name', name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Company', data.company],
    ['Project Type', data.projectType],
    ['Newsletter', data.newsletter ? 'Yes' : 'No'],
  ];

  const html = `
    <h2>New Project Inquiry</h2>
    ${rows.map(([label, value]) => `<p><b>${label}:</b> ${escapeHtml(value)}</p>`).join('\n')}
    <hr/>
    <p><b>Project Details:</b></p>
    <p>${escapeHtml(data.message).replace(/\n/g, '<br/>')}</p>
  `;
  const text = `${subject}\n\n${rows.map(([l, v]) => `${l}: ${v}`).join('\n')}\n\n${data.message}`;

  await getTransporter().sendMail({
    from: { name: 'BlackCode Contact', address: env.GMAIL_USER },
    to: env.CONTACT_TO_EMAIL,
    replyTo: { name, address: oneLine(data.email) },
    subject,
    html,
    text,
  });
}
