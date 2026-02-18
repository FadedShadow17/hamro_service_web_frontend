/// <reference path="../../jest.d.ts" />
import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/hooks/useToast';

describe('useToast Hook Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should show toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message', 'info');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]?.message).toBe('Test message');
    expect(result.current.toasts[0]?.type).toBe('info');
  });

  test('should hide toast', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string | undefined;
    act(() => {
      toastId = result.current.showToast('Test message');
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      if (toastId) {
        result.current.removeToast(toastId);
      }
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  test('should handle toast types', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Success message');
      result.current.error('Error message');
      result.current.info('Info message');
      result.current.warning('Warning message');
    });

    expect(result.current.toasts).toHaveLength(4);
    expect(result.current.toasts[0]?.type).toBe('success');
    expect(result.current.toasts[1]?.type).toBe('error');
    expect(result.current.toasts[2]?.type).toBe('info');
    expect(result.current.toasts[3]?.type).toBe('warning');
  });

  test('should return toast id when showing toast', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string | undefined;
    act(() => {
      toastId = result.current.showToast('Test message');
    });

    expect(toastId).toBeDefined();
    expect(typeof toastId).toBe('string');
  });
});
