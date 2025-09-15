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
    const sessions = await prisma.session.findMany({
      where: { userId, revoked: false },
      include: { device: true },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Sessions error:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

async function DELETE(req) {
  try {
    const { sessionId } = await req.json();
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET || "secret");
    await prisma.session.update({
      where: { id: sessionId, userId },
      data: { revoked: true },
    });

    return NextResponse.json({ message: "Session revoked" });
  } catch (error) {
    console.error("Revoke session error:", error);
    return NextResponse.json({ error: "Failed to revoke session" }, { status: 500 });
  }
}

export { GET, DELETE };