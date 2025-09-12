import nodemailer from 'nodemailer';

// Create a reusable transporter object for Brevo SMTP
const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  secure:false,
  auth: {
    user: "shivamoffice23@gmail.com",
    pass: "32254a090f5b26066026ceeafdc7b0bd"
  }
});

// Utility function to send OTP email
export async function sendOtpEmail({ to, otp }) {
  // Email options with OTP template
  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`, // Sender address
    to, // Recipient email
    subject: 'Your OTP Code', // Subject line
    text: `Your OTP code is: ${otp}. It expires in 10 minutes.`, // Plain text body
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Your OTP Code</h2>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">Your One-Time Password (OTP) is:</p>
        <h3 style="font-size: 24px; color: #007bff;">${otp}</h3>
        <p style="font-size: 16px;">This code expires in 10 minutes. Please use it to complete your verification.</p>
        <p style="font-size: 14px; color: #666;">If you did not request this, please ignore this email.</p>
        <p style="font-size: 14px;">Best regards,<br>Your App Team</p>
      </div>
    `, // HTML body
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: 'OTP email sent successfully', messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message || 'Failed to send OTP email' };
  }
}