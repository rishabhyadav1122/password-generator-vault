import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || '9ad1484bdc844069b4e52338fb3b7bfa';

export interface AuthUser {
  userId: string;
  email: string;
}

export function getAuthToken(request: NextRequest): string | null {
  return request.cookies.get('auth-token')?.value || null;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch {
    return null;
  }
}

export function getCurrentUser(request: NextRequest): AuthUser | null {
  const token = getAuthToken(request);
  if (!token) return null;
  
  return verifyToken(token);
}
