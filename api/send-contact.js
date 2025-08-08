// api/send-contact.js
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    firstName, lastName, email, phone = '', company = '',
    projectType, message, newsletter
  } = req.body || {};

  if (!firstName || !lastName || !email || !projectType || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,          // set in Vercel env
        pass: process.env.GMAIL_APP_PASSWORD,  // set in Vercel env (App Password)
      },
    });

    const subject = `New Project Inquiry — ${firstName} ${lastName}`;
    const html = `
      <h2>New Project Inquiry</h2>
      <p><b>Name:</b> ${firstName} ${lastName}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Company:</b> ${company}</p>
      <p><b>Project Type:</b> ${projectType}</p>
      <p><b>Newsletter:</b> ${newsletter ? 'Yes' : 'No'}</p>
      <hr/>
      <p><b>Project Details:</b></p>
      <p>${String(message).replace(/\n/g, '<br/>')}</p>
    `;

    await transporter.sendMail({
      from: `"BlackCode Contact" <${process.env.GMAIL_USER}>`,           // must be your Gmail
      to: process.env.TO_EMAIL || 'helloblackcodedev@gmail.com',         // recipient
      replyTo: `${firstName} ${lastName} <${email}>`,                    // replies go to sender
      subject,
      html,
      text: `${subject}\n\nFrom: ${firstName} ${lastName} <${email}>\nPhone: ${phone}\nCompany: ${company}\nType: ${projectType}\nNewsletter: ${newsletter ? 'Yes' : 'No'}\n\n${message}`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send-contact error:', err);
    return res.status(500).json({ error: 'Email send failed' });
  }
};
