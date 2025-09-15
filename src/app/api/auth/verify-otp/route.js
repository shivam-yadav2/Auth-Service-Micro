import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


async function POST(req) {
  try {
    const { email, phone, code } = await req.json();

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

    // Find valid OTP
    const otp = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        code,
        type: email ? "EMAIL" : "PHONE",
        expiresAt: { gt: new Date() },
        isUsed: false,
      },
    });

    if (!otp) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Mark OTP as used and verify user
    await prisma.$transaction([
      prisma.otp.update({
        where: { id: otp.id },
        data: { isUsed: true },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      }),
    ]);

    return NextResponse.json({ message: "OTP verified, user verified" });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}

export { POST };