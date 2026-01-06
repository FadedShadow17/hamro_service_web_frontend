export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'provider';
  createdAt?: Date;
  updatedAt?: Date;
}

export const USER_ROLES = {
  USER: 'user',
  PROVIDER: 'provider',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export function isUser(user: User | null): boolean {
  return user?.role === USER_ROLES.USER;
}

export function isProvider(user: User | null): boolean {
  return user?.role === USER_ROLES.PROVIDER;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function setUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

