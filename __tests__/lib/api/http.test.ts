/// <reference path="../../../jest.d.ts" />
import { http, HttpError } from '@/lib/api/http';

// Mock fetch
(global as any).fetch = jest.fn();

describe('HTTP Client Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('GET requests', () => {
    test('should make successful GET request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: 'test' }),
      });

      const result = await http('/api/test');
      
      expect(result).toEqual({ data: 'test' });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test'),
        expect.objectContaining({ method: 'GET' })
      );
    });
  });

  describe('POST requests', () => {
    test('should make successful POST request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true }),
      });

      const result = await http('/api/test', {
        method: 'POST',
        body: { test: 'data' },
      });
      
      expect(result).toEqual({ success: true });
    });
  });

  describe('Error handling', () => {
    test('should handle 401 error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(http('/api/test')).rejects.toThrow(HttpError);
    });

    test('should handle 404 error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Not Found' }),
      });

      await expect(http('/api/test')).rejects.toThrow(HttpError);
    });

    test('should handle network error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(http('/api/test')).rejects.toThrow(HttpError);
    });
  });
});
