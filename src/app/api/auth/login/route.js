import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
// import { sendOtpEmail } from "@/lib/mail";

export async function GET(req) {
  // Create a transporter for SMTP
  
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Or specify manually: host: 'smtp.gmail.com', port: 587, secure: false
  auth: {
    user: "shivamoffice23@gmail.com",  // Your Gmail address
    pass: "wyiw pqjh libc ghcy",  // Your App Password
  },
  // Optional: TLS settings for better security
  tls: {
    rejectUnauthorized: false  // For self-signed certs; set to true in production
  }
});


  await transporter.verify();
  console.log("Server is ready to take our messages");
  (async () => {
    try {
      const info = await transporter.sendMail({
        from: 'shivamoffice23@gmail.com', // sender address
        to: "shivamyadav6546@gmail.com", // list of receivers
        subject: "Hello", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
      console.error("Error while sending mail", err);
    }
  })();
  

  return NextResponse.json({ message: "Hello from GET /api/auth/login" });
}
