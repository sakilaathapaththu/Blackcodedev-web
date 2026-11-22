import { sendContactEmail } from '../services/mail.service.js';

/** POST /api/contact (alias: /api/send-contact) — public contact form. */
export async function submitContact(req, res) {
  // Honeypot filled in: pretend success so bots learn nothing.
  if (req.body.website) return res.json({ ok: true });

  await sendContactEmail(req.body);
  res.json({ ok: true });
}
