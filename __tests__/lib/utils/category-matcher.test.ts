/// <reference path="../../../jest.d.ts" />
import { isCategoryMatch } from '@/lib/utils/category-matcher';

describe('Category Matcher Tests', () => {
  describe('isCategoryMatch', () => {
    test('should match electrician with electrical', () => {
      const result = isCategoryMatch('Electrician', 'Electrical');
      expect(result).toBe(true);
    });

    test('should match plumber with plumbing', () => {
      const result = isCategoryMatch('Plumber', 'Plumbing');
      expect(result).toBe(true);
    });

    test('should not match different categories', () => {
      const result = isCategoryMatch('Electrician', 'Plumbing');
      expect(result).toBe(false);
    });

    test('should return false for empty values', () => {
      const result = isCategoryMatch('', 'Electrical');
      expect(result).toBe(false);
    });
  });
});
