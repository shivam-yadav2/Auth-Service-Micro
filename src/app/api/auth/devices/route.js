import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const devices = await prisma.device.findMany({
      where: { userId },
      orderBy: { lastActiveAt: "desc" },
    });

    return NextResponse.json({ devices });
  } catch (error) {
    console.error("Devices error:", error);
    return NextResponse.json({ error: "Failed to fetch devices" }, { status: 500 });
  }
}
export { GET };