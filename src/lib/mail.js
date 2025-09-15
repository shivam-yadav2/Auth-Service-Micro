// File: lib/mail.js

import nodemailer from "nodemailer";

async function sendEmail({ to, subject, text = "", html = "", from = process.env.GMAIL_USER || "default@example.com" }) {
  // Create a transporter for SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // For development; set to true in production
    },
  });

  try {
    // Verify transporter connection
    await transporter.verify();
    console.log("SMTP server connection verified");

    // Send email
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    if (process.env.NODE_ENV !== "production") {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export { sendEmail };