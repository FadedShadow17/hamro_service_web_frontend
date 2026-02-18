/// <reference path="../../jest.d.ts" />
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component Tests', () => {
  test('should render button', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('should render button with variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary')).toBeInTheDocument();

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });

  test('should render button with sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small')).toBeInTheDocument();

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  test('should render button as link', () => {
    render(<Button href="/test">Link Button</Button>);
    const link = screen.getByText('Link Button').closest('a');
    expect(link).toHaveAttribute('href', '/test');
  });

  test('should handle click event', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
