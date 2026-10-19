import { render } from '@testing-library/react';
import StarIcon from '../../../src/components/StarRating/StarIcon';

describe('StarIcon', () => {
  it('renders a single star path', () => {
    const { container } = render(<StarIcon />);
    expect(container.querySelectorAll('svg path')).toHaveLength(1);
  });

  it('is decorative: hidden from screen readers and not focusable', () => {
    const { container } = render(<StarIcon />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
  });

  it('passes the className through so it can be styled', () => {
    const { container } = render(<StarIcon className="custom-star" />);
    expect(container.querySelector('svg')).toHaveClass('custom-star');
  });
});
