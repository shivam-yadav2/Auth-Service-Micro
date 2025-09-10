import { hashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  // validat the request
  // chek the user exist
  // hash the password
  // craeate the user
  // return the response

  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
    },
  });

    return NextResponse.json(
        { message: "User created successfully", userId: newUser.id }, { status: 201 }
    )
}
