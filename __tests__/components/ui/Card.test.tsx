/// <reference path="../../jest.d.ts" />
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/Card';

describe('Card Component Tests', () => {
  test('should render card', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  test('should render card with title', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  test('should render card with children', () => {
    render(
      <Card>
        <div>Child 1</div>
        <div>Child 2</div>
      </Card>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});
