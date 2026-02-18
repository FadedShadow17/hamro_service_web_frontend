/// <reference path="../../../jest.d.ts" />
import { getServices, getServiceById, getAvailableProviders } from '@/lib/api/services.api';
import { http } from '@/lib/api/http';

jest.mock('@/lib/api/http');

describe('Services API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getServices', () => {
    test('should get services', async () => {
      (http as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: [{ id: '1', name: 'Service 1' }],
      });

      const result = await getServices();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Service 1');
    });

    test('should get services with active filter', async () => {
      (http as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: [],
      });

      await getServices(true);

      expect(http).toHaveBeenCalledWith('/api/services?active=true', expect.any(Object));
    });
  });

  describe('getServiceById', () => {
    test('should get service by ID', async () => {
      (http as jest.Mock).mockResolvedValueOnce({
        service: { id: '1', name: 'Service 1' },
      });

      const result = await getServiceById('1');

      expect(result.name).toBe('Service 1');
    });
  });

  describe('getAvailableProviders', () => {
    test('should get available providers', async () => {
      (http as jest.Mock).mockResolvedValueOnce({
        providers: [{ providerId: '1', providerName: 'Provider 1' }],
      });

      const result = await getAvailableProviders('service1', '2024-12-25', 'Thamel');

      expect(result).toHaveLength(1);
      expect(result[0].providerName).toBe('Provider 1');
    });
  });
});
