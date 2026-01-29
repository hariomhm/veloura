import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
  test('renders with default size', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('generic'); // div element
    expect(spinner).toHaveClass('w-8', 'h-8', 'animate-spin');
  });

  test('renders with small size', () => {
    render(<LoadingSpinner size="sm" />);
    const spinner = screen.getByRole('generic');
    expect(spinner).toHaveClass('w-4', 'h-4');
  });

  test('renders with large size', () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByRole('generic');
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  test('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    const spinner = screen.getByRole('generic');
    expect(spinner).toHaveClass('custom-class');
  });
});
