import { screen, within } from '@testing-library/react';
import { renderWithTheme } from '../../renderWithTheme';
import RatingBreakdown from '../../../src/components/RatingBreakdown/RatingBreakdown';

const BREAKDOWN = [
  { stars: 5, count: 952, percentage: 77.27 },
  { stars: 4, count: 171, percentage: 13.88 },
  { stars: 3, count: 55, percentage: 4.46 },
  { stars: 2, count: 14, percentage: 1.14 },
  { stars: 1, count: 40, percentage: 3.25 },
];

describe('RatingBreakdown', () => {
  it('renders a labelled list', () => {
    renderWithTheme(<RatingBreakdown breakdown={BREAKDOWN} />);
    expect(screen.getByRole('list', { name: 'Rating breakdown' })).toBeInTheDocument();
  });

  it('sets role="list" explicitly, as Safari drops it when list-style is none', () => {
    renderWithTheme(<RatingBreakdown breakdown={BREAKDOWN} />);
    expect(screen.getByRole('list')).toHaveAttribute('role', 'list');
  });

  it('renders one row per star value in the given order', () => {
    renderWithTheme(<RatingBreakdown breakdown={BREAKDOWN} />);
    const rows = within(screen.getByRole('list')).getAllByRole('listitem');

    expect(rows).toHaveLength(5);
    expect(rows[0]).toHaveTextContent('5 stars: 952 reviews (77%)');
    expect(rows[4]).toHaveTextContent('1 star: 40 reviews (3%)');
  });

  it('renders an empty list when there is no data', () => {
    renderWithTheme(<RatingBreakdown breakdown={[]} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
