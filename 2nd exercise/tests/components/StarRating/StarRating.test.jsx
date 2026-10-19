import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../renderWithTheme';
import StarRating from '../../../src/components/StarRating/StarRating';

describe('StarRating', () => {
  it('exposes the rating as a single labelled image', () => {
    renderWithTheme(<StarRating rating={4.6} />);
    expect(screen.getByRole('img', { name: 'Rated 4.6 out of 5 stars' })).toBeInTheDocument();
  });

  it('renders five tiles by default', () => {
    renderWithTheme(<StarRating rating={3} />);
    expect(screen.getAllByTestId('star-tile')).toHaveLength(5);
  });

  it('fills whole stars and the last star partially', () => {
    renderWithTheme(<StarRating rating={4.6} />);
    const tiles = screen.getAllByTestId('star-tile');

    tiles.slice(0, 4).forEach((tile) => expect(tile).toHaveStyleRule('background', /#ffc933 100%/));
    expect(tiles[4]).toHaveStyleRule('background', /#ffc933 60%/);
  });

  it('leaves every star empty for a rating of zero', () => {
    renderWithTheme(<StarRating rating={0} />);
    screen.getAllByTestId('star-tile').forEach((tile) => {
      expect(tile).toHaveStyleRule('background', /#ffc933 0%/);
    });
  });

  it('clamps ratings outside the valid range', () => {
    const { unmount } = renderWithTheme(<StarRating rating={7} />);
    expect(screen.getByRole('img', { name: 'Rated 5 out of 5 stars' })).toBeInTheDocument();
    unmount();

    renderWithTheme(<StarRating rating={-1} />);
    expect(screen.getByRole('img', { name: 'Rated 0 out of 5 stars' })).toBeInTheDocument();
  });

  it('supports a custom number of stars', () => {
    renderWithTheme(<StarRating rating={2} max={3} />);
    expect(screen.getAllByTestId('star-tile')).toHaveLength(3);
    expect(screen.getByRole('img', { name: 'Rated 2 out of 3 stars' })).toBeInTheDocument();
  });

  it('hides the decorative star icons from assistive technology', () => {
    const { container } = renderWithTheme(<StarRating rating={4} />);
    container.querySelectorAll('svg').forEach((svg) => {
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
