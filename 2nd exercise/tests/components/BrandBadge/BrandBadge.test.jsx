import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../renderWithTheme';
import BrandBadge from '../../../src/components/BrandBadge/BrandBadge';

describe('BrandBadge', () => {
  it('renders the title as a level 2 heading', () => {
    renderWithTheme(<BrandBadge title="Product Rating" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Product Rating' })).toBeInTheDocument();
  });

  it('applies the heading id so a region can be labelled by it', () => {
    renderWithTheme(<BrandBadge title="Product Rating" headingId="rating-heading" />);
    expect(screen.getByRole('heading')).toHaveAttribute('id', 'rating-heading');
  });

  it('renders the logo as an image with an accessible name', () => {
    renderWithTheme(<BrandBadge title="Product Rating" />);
    expect(screen.getByRole('img', { name: 'feefo' })).toBeInTheDocument();
  });
});
