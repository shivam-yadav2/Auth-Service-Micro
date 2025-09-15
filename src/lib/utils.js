import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs";

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
function generateDeviceId(req) {
  const userAgent = req.headers["user-agent"] || "";
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  return require("crypto").createHash("md5").update(userAgent + ip).digest("hex");
}

function getClientIp(req) {
  return req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
}

export { generateOtp, hashPassword, verifyPassword, generateDeviceId, getClientIp };