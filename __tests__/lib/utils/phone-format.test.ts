/// <reference path="../../../jest.d.ts" />
import { formatPhoneInput, handlePhoneChange, getPhoneCursorPosition } from '@/lib/utils/phone-format';

describe('Phone Format Utility Tests', () => {
  describe('formatPhoneInput', () => {
    test('should format phone input with prefix', () => {
      const result = formatPhoneInput('+977-9841234567');
      expect(result).toBe('+977-9841234567');
    });

    test('should format phone without prefix', () => {
      const result = formatPhoneInput('9841234567');
      expect(result).toBe('+977-9841234567');
    });

    test('should handle phone starting with 977', () => {
      const result = formatPhoneInput('9779841234567');
      expect(result).toBe('+977-9841234567');
    });

    test('should remove non-digit characters', () => {
      const result = formatPhoneInput('+977-984-123-4567');
      expect(result).toBe('+977-9841234567');
    });
  });

  describe('handlePhoneChange', () => {
    test('should handle phone change', () => {
      const setValue = jest.fn();
      handlePhoneChange('+977-', '+977-9', setValue);
      
      expect(setValue).toHaveBeenCalled();
    });

    test('should prevent deleting prefix', () => {
      const setValue = jest.fn();
      handlePhoneChange('+977-984', '+977-', setValue);
      
      expect(setValue).toHaveBeenCalledWith('+977-');
    });
  });

  describe('getPhoneCursorPosition', () => {
    test('should calculate cursor position', () => {
      const result = getPhoneCursorPosition('+977-984', '+977-9841', 8);
      expect(result).toBeGreaterThanOrEqual(0);
    });

    test('should handle cursor in prefix area', () => {
      const result = getPhoneCursorPosition('+977-', '+977-', 3);
      expect(result).toBe(6); // After prefix
    });
  });
});
