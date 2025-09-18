import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { generateOtp, generateDeviceId, getClientIp } from "@/lib/utils";
import { sendEmail } from "@/lib/mail";
import crypto from "crypto";

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

  // console.log("Login request received" , req);
  try {
    const { email, phone, password  } = await req.json();

    if (!email && !phone) {
      return NextResponse.json({ error: "Email or phone required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify password
    if (password && user.passwordHash && !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // If not verified, send OTP
    if (!user.isVerified) {
      const otpCode = generateOtp();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.otp.create({
        data: {
          userId: user.id,
          code: otpCode,
          type: email ? "EMAIL" : "PHONE",
          expiresAt,
        },
      });

      if (email) {
        await sendOtpEmail({ to: email, otpCode });
      } else {
        console.log(`SMS OTP ${otpCode} for ${phone}`);
      }

      return NextResponse.json({ message: "OTP sent for verification" });
    }

    // Use client-provided deviceId and IP if available
    const deviceId = req.headers.get("x-device-id") || generateDeviceId(req);
    const ipAddress = req.headers.get("x-client-ip") || getClientIp(req);

    // Create or update device
    let device = await prisma.device.findUnique({ where: { deviceId } });
    if (!device) {
      device = await prisma.device.create({
        data: {
          userId: user.id,
          deviceId,
          deviceType: req.headers.get("user-agent")?.includes("Mobile") ? "mobile" : "web",
          deviceName: "Unknown Device",
          location: ipAddress,
          lastActiveAt: new Date(),
        },
      });
    } else {
      await prisma.device.update({
        where: { id: device.id },
        data: { lastActiveAt: new Date(), location: ipAddress },
      });
    }

    // Create session
    const token = jwt.sign({ userId: user.id, deviceId }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    });
    // Hash the token
const tokenHash = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        deviceId: device.id,
        tokenHash,
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return NextResponse.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}

export { POST };