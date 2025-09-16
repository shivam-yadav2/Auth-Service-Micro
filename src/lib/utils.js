import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Utility function to merge class names

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Simple device fingerprint (could be enhanced with user-agent parsing libraries)
function getClientIp(req) {
  // Use NextRequest headers
  const xForwardedFor = req.headers.get("x-forwarded-for");
  const vercelForwardedFor = req.headers.get("x-vercel-forwarded-for"); // For Vercel
  const ip = xForwardedFor
    ? xForwardedFor.split(",")[0].trim() // First IP is the client
    : vercelForwardedFor || "unknown";
  console.log(
    "X-Forwarded-For:",
    xForwardedFor,
    "Vercel-Forwarded-For:",
    vercelForwardedFor
  ); // Debug
  return ip;
}

function generateDeviceId(req) {
  const userAgent = req.headers.get("user-agent") || "";
  const ip = getClientIp(req);
  const acceptLanguage = req.headers.get("accept-language") || ""; // Additional uniqueness
  const fingerprint = `${userAgent}${ip}${acceptLanguage}`;
  console.log("Device Fingerprint:", fingerprint); // Debug
  return crypto.createHash("sha256").update(fingerprint).digest("hex");
}

export {
  generateOtp,
  hashPassword,
  verifyPassword,
  generateDeviceId,
  getClientIp,
};
