// ============================================================
// contactRoutes.js — Contact Form Email Route
// ============================================================

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// --- Rate limiting for the contact form ---
// Prevents someone from spamming your inbox.
// Install: npm install express-rate-limit
const rateLimit = require("express-rate-limit");

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15-minute window
  max: 3,                      // Max 3 requests per IP per window
  message: {
    success: false,
    error: "Too many messages sent. Please wait 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/contact
router.post("/", contactLimiter, async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      const error = new Error("Name, email, and message are required");
      error.statusCode = 400;
      return next(error);
    }

    // --- Configure Nodemailer transporter ---
    // Uses Gmail SMTP. For production, consider SendGrid or Resend
    // which have better deliverability and free tiers.
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,   // Gmail App Password
      },
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `[Portfolio] New message from ${name}`,
      html: `
        <div style="font-family: monospace; padding: 20px; background: #0a0a0a; color: #00FF94;">
          <h2 style="color: #00FF94;">New Contact Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <hr style="border-color: #00FF94; opacity: 0.3;" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
      // Send a plain text fallback as well
      text: `From: ${name} (${email})\n\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Message transmitted successfully.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;