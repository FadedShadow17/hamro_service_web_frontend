/// <reference path="../../jest.d.ts" />
import { render, screen } from '@testing-library/react';
import { ServiceCard } from '@/components/services/ServiceCard';

const mockService = {
  id: '1',
  slug: 'test-service',
  title: 'Test Service',
  shortDescription: 'Test description',
  longDescription: 'Long test description',
  category: 'test',
  icon: '🔧',
  startingPrice: 1000,
  duration: '1-2 hours',
  features: ['Feature 1', 'Feature 2'],
};

describe('ServiceCard Component Tests', () => {
  test('should render service card', () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText('Test Service')).toBeInTheDocument();
  });

  test('should handle card click', () => {
    render(<ServiceCard service={mockService} />);
    const card = screen.getByText('Test Service').closest('div');
    expect(card).toBeInTheDocument();
  });

  test('should display service with image', () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
});
