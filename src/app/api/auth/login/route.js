import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  return NextResponse.json({ message: "Hello from GET /api/auth/login" });
}
