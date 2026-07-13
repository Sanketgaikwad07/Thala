import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { OAuth2Client } from 'google-auth-library';
import { db } from '../../data/db';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { User } from '../../types/models';

const googleClient = new OAuth2Client(env.google.clientId || undefined);

function toPublicUser(user: User) {
  const { passwordHash, tokenVersion, ...rest } = user;
  return rest;
}

function issueTokens(user: User) {
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, tokenVersion: user.tokenVersion });
  return { accessToken, refreshToken };
}

export async function register(input: { name: string; email: string; password: string; phone?: string }) {
  const existing = db.users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const passwordHash = await bcrypt.hash(input.password, 10);
  const now = new Date().toISOString();
  const user: User = {
    id: uuid(),
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone,
    passwordHash,
    role: 'user',
    provider: 'password',
    isEmailVerified: false,
    tokenVersion: 0,
    medicalConditions: [],
    createdAt: now,
    updatedAt: now,
  };
  db.users.push(user);

  const tokens = issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

export async function login(email: string, password: string) {
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !user.passwordHash) throw ApiError.unauthorized('Invalid email or password');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw ApiError.unauthorized('Invalid email or password');

  const tokens = issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

export async function refresh(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = db.users.find((u) => u.id === payload.sub);
  if (!user) throw ApiError.unauthorized('User no longer exists');
  if (user.tokenVersion !== payload.tokenVersion) {
    throw ApiError.unauthorized('Refresh token has been revoked');
  }

  const tokens = issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

export function logout(userId: string) {
  const user = db.users.find((u) => u.id === userId);
  if (user) user.tokenVersion += 1;
  return { success: true };
}

export function requestOtp(destination: string, purpose: 'login' | 'register' | 'reset_password') {
  const code = env.otp.staticDevCode;
  const expiresAt = new Date(Date.now() + env.otp.expiresInMinutes * 60 * 1000).toISOString();
  db.otps.push({ id: uuid(), destination: destination.toLowerCase(), code, purpose, expiresAt, consumed: false });

  // eslint-disable-next-line no-console
  console.log(`[OTP MOCK] Sending OTP ${code} to ${destination} for ${purpose}`);
  return { message: 'OTP sent successfully', devHint: env.isProd ? undefined : code };
}

export async function verifyOtp(destination: string, code: string, purpose: 'login' | 'register' | 'reset_password') {
  const record = [...db.otps]
    .reverse()
    .find((o) => o.destination === destination.toLowerCase() && o.purpose === purpose && !o.consumed);

  if (!record) throw ApiError.badRequest('No pending OTP request found for this destination');
  if (new Date(record.expiresAt).getTime() < Date.now()) throw ApiError.badRequest('OTP has expired, please request a new one');
  if (record.code !== code) throw ApiError.badRequest('Invalid OTP code');

  record.consumed = true;

  if (purpose === 'reset_password') {
    return { verified: true };
  }

  let user = db.users.find((u) => u.email.toLowerCase() === destination.toLowerCase() || u.phone === destination);
  if (!user) {
    const now = new Date().toISOString();
    user = {
      id: uuid(),
      name: destination.split('@')[0] || 'New User',
      email: destination.includes('@') ? destination.toLowerCase() : `${destination}@otp.thala.app`,
      phone: destination.includes('@') ? undefined : destination,
      role: 'user',
      provider: 'otp',
      isEmailVerified: destination.includes('@'),
      tokenVersion: 0,
      medicalConditions: [],
      createdAt: now,
      updatedAt: now,
    };
    db.users.push(user);
  }

  const tokens = issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

export async function googleSignIn(idToken: string) {
  let email: string;
  let name: string;
  let photoUrl: string | undefined;

  if (env.google.clientId) {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: env.google.clientId });
    const payload = ticket.getPayload();
    if (!payload?.email) throw ApiError.unauthorized('Unable to verify Google account');
    email = payload.email;
    name = payload.name || email.split('@')[0];
    photoUrl = payload.picture;
  } else {
    // Demo mode without a configured Google client: decode the token payload
    // without cryptographic verification, purely so the flow is testable end-to-end.
    const [, payloadB64] = idToken.split('.');
    if (!payloadB64) throw ApiError.badRequest('Malformed Google ID token');
    const decoded = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf-8'));
    email = decoded.email;
    name = decoded.name || email?.split('@')[0] || 'Google User';
    photoUrl = decoded.picture;
  }

  if (!email) throw ApiError.badRequest('Google token did not contain an email address');

  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  const now = new Date().toISOString();
  if (!user) {
    user = {
      id: uuid(),
      name,
      email: email.toLowerCase(),
      photoUrl,
      role: 'user',
      provider: 'google',
      isEmailVerified: true,
      tokenVersion: 0,
      medicalConditions: [],
      createdAt: now,
      updatedAt: now,
    };
    db.users.push(user);
  }

  const tokens = issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

export function forgotPassword(email: string) {
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  // Always respond the same way whether or not the user exists, to avoid account enumeration.
  if (user) {
    requestOtp(email, 'reset_password');
  }
  return { message: 'If that email exists, a password reset code has been sent.' };
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  await verifyOtp(email, code, 'reset_password');
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw ApiError.notFound('User not found');
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.tokenVersion += 1;
  user.updatedAt = new Date().toISOString();
  return { message: 'Password has been reset successfully' };
}
