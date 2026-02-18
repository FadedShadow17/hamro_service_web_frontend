/// <reference path="../../../jest.d.ts" />
import { createContact, getMyContacts, getTestimonials } from '@/lib/contact/contact.api';
import { http } from '@/lib/api/http';
import { getToken } from '@/lib/auth/auth.storage';

jest.mock('@/lib/api/http');
jest.mock('@/lib/auth/auth.storage');

describe('Contact API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getToken as jest.Mock).mockReturnValue('test-token');
  });

  describe('createContact', () => {
    test('should create contact', async () => {
      (http as jest.Mock).mockResolvedValueOnce({
        message: 'Contact created',
        contact: { id: '1', subject: 'Test' },
      });

      const result = await createContact({
        subject: 'Test Subject',
        message: 'Test message',
        category: 'General',
      });

      expect(result.message).toBe('Contact created');
      expect(http).toHaveBeenCalledWith('/api/v1/contact', expect.objectContaining({
        method: 'POST',
      }));
    });
  });

  describe('getMyContacts', () => {
    test('should get user contacts', async () => {
      (http as jest.Mock).mockResolvedValueOnce({
        message: 'Success',
        contacts: [{ id: '1', subject: 'Test' }],
      });

      const result = await getMyContacts();

      expect(result.contacts).toHaveLength(1);
    });
  });

  describe('getTestimonials', () => {
    test('should get testimonials', async () => {
      (http as jest.Mock).mockResolvedValueOnce({
        message: 'Success',
        testimonials: [{ id: '1', content: 'Great service' }],
      });

      const result = await getTestimonials();

      expect(result.testimonials).toHaveLength(1);
    });

    test('should get testimonials with limit', async () => {
      (http as jest.Mock).mockResolvedValueOnce({
        message: 'Success',
        testimonials: [],
      });

      await getTestimonials(5);

      expect(http).toHaveBeenCalledWith('/api/v1/contact/testimonials?limit=5', expect.any(Object));
    });
  });
});
