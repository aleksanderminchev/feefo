import { screen, within } from '@testing-library/react';
import { renderWithTheme } from '../../renderWithTheme';
import ProductRating from '../../../src/components/ProductRating/ProductRating';

const RATINGS = [
  { stars: 5, count: 952 },
  { stars: 4, count: 171 },
  { stars: 3, count: 55 },
  { stars: 2, count: 14 },
  { stars: 1, count: 40 },
];

describe('ProductRating', () => {
  it('is a region named by its heading', () => {
    renderWithTheme(<ProductRating ratings={RATINGS} />);
    expect(screen.getByRole('region', { name: 'Product Rating' })).toBeInTheDocument();
  });

  it('renders the summary from the design data', () => {
    renderWithTheme(<ProductRating ratings={RATINGS} />);
    const region = screen.getByRole('region');

    expect(within(region).getByText('Excellent')).toBeInTheDocument();
    expect(within(region).getByRole('img', { name: 'Rated 4.6 out of 5 stars' })).toBeInTheDocument();
    expect(within(region).getByText('4.6 out of 5')).toBeInTheDocument();
    expect(within(region).getByText('Based on 1,232 reviews')).toBeInTheDocument();
    expect(within(region).getByRole('img', { name: 'feefo' })).toBeInTheDocument();
    expect(within(region).getAllByRole('listitem')).toHaveLength(5);
  });

  it('supports a custom title', () => {
    renderWithTheme(<ProductRating ratings={RATINGS} title="Service Rating" />);
    expect(screen.getByRole('region', { name: 'Service Rating' })).toBeInTheDocument();
  });

  it('gives each instance a unique heading id', () => {
    renderWithTheme(
      <>
        <ProductRating ratings={RATINGS} />
        <ProductRating ratings={RATINGS} title="Service Rating" />
      </>,
    );
    const [first, second] = screen.getAllByRole('heading');
    expect(first.id).not.toBe(second.id);
  });

  it('renders an empty state when there are no ratings', () => {
    renderWithTheme(<ProductRating ratings={[]} />);

    expect(screen.getByText('No ratings yet')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Rated 0 out of 5 stars' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('5 stars: 0 reviews (0%)');
  });

  it('warns through PropTypes about invalid ratings', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    renderWithTheme(<ProductRating ratings={[{ stars: 9, count: 3 }]} />);

    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('Failed %s type'),
      'prop',
      expect.stringContaining('ratings[0].stars'),
      expect.anything(),
    );
    consoleError.mockRestore();
  });
});
