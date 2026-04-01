const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/emailService');

/**
 * POST /api/email/send
 * Body: { email, subject, message, html }
 */
router.post('/send', async (req, res) => {
  const { email, subject, message, html } = req.body;
  if (!email || !subject) {
    return res.status(400).json({ error: 'email and subject are required' });
  }
  try {
    await sendEmail({ email, subject, message, html });
    res.json({ ok: true, msg: 'Email sent' });
  } catch (err) {
    console.error('Email route error:', err);
    res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
});

module.exports = router;
