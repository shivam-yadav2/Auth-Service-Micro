import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { totp } from 'otplib';
// import UAParser from 'ua-parser-js';

totp.options = { digits: 6, step: 300 }; // 6-digit OTP, expires in 5 min

// Hash password
export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Generate JWT
export function generateJwt(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT
export function verifyJwt(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Generate OTP
export function generateOtp() {
  return totp.generate(process.env.OTP_SECRET || 'secret');
}

// Verify OTP
export function verifyOtp(code) {
  return totp.check(code, process.env.OTP_SECRET || 'secret');
}

// Generate device ID (fingerprint)
// export function generateDeviceId(req) {
//   const parser = new UAParser(req.headers['user-agent']);
//   const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
//   return `${parser.getDevice().model || 'unknown'}-${ip}-${Date.now()}`; // Simple hash
// }