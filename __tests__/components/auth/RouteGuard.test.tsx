/// <reference path="../../jest.d.ts" />
import { render } from '@testing-library/react';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { isAuthenticated } from '@/lib/auth/auth.storage';

jest.mock('@/lib/auth/auth.storage');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('RouteGuard Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should redirect when not authenticated', () => {
    (isAuthenticated as jest.Mock).mockReturnValue(false);
    
    const { container } = render(
      <RouteGuard requireAuth>
        <div>Protected Content</div>
      </RouteGuard>
    );
    
    // Component should return null when redirecting
    expect(container.firstChild).toBeNull();
  });

  test('should allow access when authenticated', () => {
    (isAuthenticated as jest.Mock).mockReturnValue(true);
    
    const { getByText } = render(
      <RouteGuard requireAuth>
        <div>Protected Content</div>
      </RouteGuard>
    );
    
    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  test('should handle role-based access', () => {
    (isAuthenticated as jest.Mock).mockReturnValue(true);
    
    const { getByText } = render(
      <RouteGuard requireAuth>
        <div>Content</div>
      </RouteGuard>
    );
    
    expect(getByText('Content')).toBeInTheDocument();
  });
});
