/// <reference path="../../jest.d.ts" />
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/components/dashboard/StatCard';

describe('StatCard Component Tests', () => {
  test('should render stat card', () => {
    render(
      <StatCard
        value="100"
        label="Total"
        icon={<span>📊</span>}
        color="green"
      />
    );
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  test('should render card with value', () => {
    render(
      <StatCard
        value={50}
        label="Count"
        icon={<span>📈</span>}
        color="blue"
      />
    );
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  test('should render card with label', () => {
    render(
      <StatCard
        value="200"
        label="Users"
        icon={<span>👥</span>}
        color="orange"
      />
    );
    expect(screen.getByText('Users')).toBeInTheDocument();
  });
});
