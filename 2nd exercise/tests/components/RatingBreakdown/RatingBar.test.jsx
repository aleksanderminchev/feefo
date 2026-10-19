import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../renderWithTheme';
import RatingBar from '../../../src/components/RatingBreakdown/RatingBar';

const renderBar = (props) =>
  renderWithTheme(
    <ul>
      <RatingBar stars={5} count={952} percentage={77.27} {...props} />
    </ul>,
  );

describe('RatingBar', () => {
  it('describes the row in a single sentence for screen readers', () => {
    renderBar();
    expect(screen.getByRole('listitem')).toHaveTextContent('5 stars: 952 reviews (77%)');
  });

  it('shows the visual star value and count, hidden from screen readers', () => {
    renderBar({ count: 1500 });
    expect(screen.getByText('5')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('1,500')).toHaveAttribute('aria-hidden', 'true');
  });

  it('sets the bar width from the percentage', () => {
    renderBar();
    expect(screen.getByTestId('rating-bar-fill')).toHaveStyleRule('width', '77.27%');
  });

  it('keeps a minimum sliver visible only when there are reviews', () => {
    const { unmount } = renderBar({ count: 14, percentage: 1.1 });
    expect(screen.getByTestId('rating-bar-fill')).toHaveStyleRule('min-width', '0.25rem');
    unmount();

    renderBar({ count: 0, percentage: 0 });
    expect(screen.getByTestId('rating-bar-fill')).toHaveStyleRule('min-width', '0');
  });

  it.each([
    [-10, '0%'],
    [150, '100%'],
  ])('clamps a percentage of %s to %s', (percentage, width) => {
    renderBar({ percentage });
    expect(screen.getByTestId('rating-bar-fill')).toHaveStyleRule('width', width);
  });

  it('uses the singular for one star and one review', () => {
    renderBar({ stars: 1, count: 1, percentage: 100 });
    expect(screen.getByRole('listitem')).toHaveTextContent('1 star: 1 review (100%)');
  });
});
