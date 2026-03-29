"use server";

import { Resend } from "resend";

const getResend = () => new Resend(process.env.RESEND_API_KEY || "dummy_key");

/**
 * sendContactEmail — Server Action
 * 
 * Takes the form data and sends an email to the site owner (Adarsh).
 * This eliminates the need for 3rd party services like Formspree.
 */
export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    throw new Error("All fields are required.");
  }

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // replace with verified domain later
      to: "agarwalaadarsh.work@gmail.com",
      replyTo: email,
      subject: `[CONTACT] ${subject} — from ${name}`,
      html: `
        <div style="font-family: 'Courier New', monospace; background: #0a0a0a; color: #f2f2f2; padding: 40px; border: 1px solid #C5A059;">
          <div style="color: #C5A059; font-size: 11px; letter-spacing: 0.1em; margin-bottom: 2rem;">
            ADARSH-SYS v1.0 — INBOUND MESSAGE
          </div>
          <h1 style="font-family: Georgia, serif; font-size: 24px; color: #f2f2f2; margin: 0 0 1.5rem;">
            New Message Received.
          </h1>
          <div style="margin-bottom: 2rem;">
            <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="padding: 20px; border: 1px solid #222; background: #111; color: #ccc; line-height: 1.6; white-space: pre-wrap;">
${message}
          </div>
          <div style="margin-top: 3rem; font-size: 11px; color: #555;">
            Sent from adarshagarwala.com contact infrastructure.
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(error.message);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Contact form failure:", err);
    throw new Error("System failure: " + err.message);
  }
}
