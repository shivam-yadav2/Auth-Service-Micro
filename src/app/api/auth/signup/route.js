import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateOtp } from "@/lib/utils";
import { sendEmail } from "@/lib/mail";

async function sendOtpEmail({ to, otpCode }) {
  const subject = "Your OTP Code";
  const text = `Your OTP code is: ${otpCode}. It will expire in 10 minutes.`;
  const html = `<p>Your OTP code is: <strong>${otpCode}</strong>. It will expire in 10 minutes.</p>`;

  try {
    await sendEmail({ to, subject, text, html });
    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send OTP email to ${to}:`, error);
    throw new Error("Failed to send OTP email");
  }
}

async function POST(req) {
  console.log(req)
  try {
    const { email, phone, password, name } = await req.json();

    if (!email && !phone) {
      return NextResponse.json({ error: "Email or phone required" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
    if (existingUser) {
      return NextResponse.json({ error: "Email or phone already registered" }, { status: 409 });
    }

    // Generate OTP
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Create user
    const passwordHash = password ? await hashPassword(password) : null;
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        passwordHash,
        name,
      },
    });

    // Create OTP
    await prisma.otp.create({
      data: {
        userId: user.id,
        code: otpCode,
        type: email ? "EMAIL" : "PHONE",
        expiresAt,
      },
    });

    // Send OTP
    if (email) {
      await sendOtpEmail({ to: email, otpCode });
    } else {
      // Placeholder for SMS (implement SMS provider like Twilio)
      console.log(`SMS OTP ${otpCode} for ${phone}`);
    }

    return NextResponse.json({ message: "User registered, OTP sent" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}

export { POST };