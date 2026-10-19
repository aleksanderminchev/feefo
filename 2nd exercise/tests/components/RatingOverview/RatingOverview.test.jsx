import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../renderWithTheme';
import RatingOverview from '../../../src/components/RatingOverview/RatingOverview';

describe('RatingOverview', () => {
  it('shows the rating word, stars and score', () => {
    renderWithTheme(<RatingOverview average={4.6} total={1232} />);

    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Rated 4.6 out of 5 stars' })).toBeInTheDocument();
    expect(screen.getByText('4.6 out of 5')).toBeInTheDocument();
  });

  it('hides the visual score from screen readers to avoid repeating the star label', () => {
    renderWithTheme(<RatingOverview average={4.6} total={1232} />);
    expect(screen.getByText('4.6 out of 5')).toHaveAttribute('aria-hidden', 'true');
  });

  it('tells screen reader users how many reviews the rating is based on', () => {
    renderWithTheme(<RatingOverview average={4.6} total={1232} />);
    expect(screen.getByText('Based on 1,232 reviews')).toBeInTheDocument();
  });

  it('uses the singular for one review', () => {
    renderWithTheme(<RatingOverview average={5} total={1} />);
    expect(screen.getByText('Based on 1 review')).toBeInTheDocument();
  });

  it('always shows the score with one decimal place', () => {
    renderWithTheme(<RatingOverview average={4} total={3} />);
    expect(screen.getByText('4.0 out of 5')).toBeInTheDocument();
  });

  it('handles having no reviews', () => {
    renderWithTheme(<RatingOverview average={0} total={0} />);
    expect(screen.getByText('No ratings yet')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Rated 0 out of 5 stars' })).toBeInTheDocument();
  });
});
