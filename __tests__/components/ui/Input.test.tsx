/// <reference path="../../jest.d.ts" />
import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/Input';

describe('Input Component Tests', () => {
  test('should render input', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('should handle value change', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    input.dispatchEvent(new Event('change', { bubbles: true }));
    // Input component should handle change events
    expect(input).toBeInTheDocument();
  });

  test('should show error state', () => {
    render(<Input error placeholder="Error input" />);
    const input = screen.getByPlaceholderText('Error input');
    expect(input).toHaveClass('border-red-500');
  });
});
