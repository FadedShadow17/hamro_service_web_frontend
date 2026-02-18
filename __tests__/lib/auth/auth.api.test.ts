/// <reference path="../../../jest.d.ts" />
import { register, login, getMe, forgotPassword } from '@/lib/auth/auth.api';
import { http } from '@/lib/api/http';

jest.mock('@/lib/api/http');

describe('Auth API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('should register user', async () => {
      (http as jest.Mock).mockResolvedValueOnce({
        message: 'User registered successfully',
        user: { id: '1', email: 'test@example.com' },
      });

      const result = await register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
      });

      expect(result.message).toBe('User registered successfully');
      expect(http).toHaveBeenCalledWith('/api/auth/register', expect.any(Object));
    });

    test('should handle registration error', async () => {
      (http as jest.Mock).mockRejectedValueOnce(new Error('Email already exists'));

      await expect(register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
      })).rejects.toThrow();
    });
  });

  describe('login', () => {
    test('should login user', async () => {
      (http as jest.Mock).mockResolvedValueOnce({
        message: 'Login successful',
        token: 'test-token',
        user: { id: '1', email: 'test@example.com' },
      });

      const result = await login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.token).toBe('test-token');
      expect(result.user.email).toBe('test@example.com');
    });
  });

  describe('getMe', () => {
    test('should get user info', async () => {
      (http as jest.Mock).mockResolvedValueOnce({
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
      });

      const result = await getMe();

      expect(result.email).toBe('test@example.com');
    });
  });

  describe('forgotPassword', () => {
    test('should call forgot password endpoint', async () => {
      (http as jest.Mock).mockResolvedValueOnce({
        message: 'Password reset email sent',
      });

      const result = await forgotPassword({ email: 'test@example.com' });

      expect(result.message).toBe('Password reset email sent');
    });
  });
});
