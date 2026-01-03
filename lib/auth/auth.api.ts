import { http, HttpError } from '@/lib/api/http';
import { User } from './auth.storage';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'service provider';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse {
  message: string;
}

export async function register(data: RegisterRequest): Promise<ApiResponse> {
  try {
    return await http<ApiResponse>('/api/auth/register', {
      method: 'POST',
      body: data,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Registration failed');
  }
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    return await http<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: data,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Login failed');
  }
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
  try {
    return await http<ApiResponse>('/api/auth/forgot-password', {
      method: 'POST',
      body: data,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      // If endpoint doesn't exist (404), return graceful fallback
      if (error.status === 404) {
        throw new HttpError(404, 'Feature coming soon');
      }
      throw error;
    }
    throw new HttpError(500, 'Request failed');
  }
}

