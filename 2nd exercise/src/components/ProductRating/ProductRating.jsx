import { useId } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import RatingOverview from '../RatingOverview/RatingOverview';
import BrandBadge from '../BrandBadge/BrandBadge';
import RatingBreakdown from '../RatingBreakdown/RatingBreakdown';
import { STAR_VALUES, summariseRatings } from '../../utils/ratings';

const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 4vw, 1.25rem);
  width: 100%;
  max-width: 26rem;
  padding: clamp(1.25rem, 6vw, 2.25rem) clamp(1rem, 6vw, 2.25rem);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surface};
  font-family: ${({ theme }) => theme.font};
  color: ${({ theme }) => theme.colors.text};
`;

const BreakdownSpacing = styled.div`
  margin-top: clamp(0.75rem, 4vw, 1.5rem);
`;

function ProductRating({ ratings, title = 'Product Rating' }) {
  const headingId = useId();
  const { total, average, breakdown } = summariseRatings(ratings);

  return (
    <Card aria-labelledby={headingId}>
      <RatingOverview average={average} total={total} />
      <BrandBadge title={title} headingId={headingId} />
      <BreakdownSpacing>
        <RatingBreakdown breakdown={breakdown} />
      </BreakdownSpacing>
    </Card>
  );
}

ProductRating.propTypes = {
  ratings: PropTypes.arrayOf(
    PropTypes.shape({
      stars: PropTypes.oneOf(STAR_VALUES).isRequired,
      count: PropTypes.number.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string,
};

export default ProductRating;
