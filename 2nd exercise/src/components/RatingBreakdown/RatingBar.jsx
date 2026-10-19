import PropTypes from 'prop-types';
import styled from 'styled-components';
import StarIcon from '../StarRating/StarIcon';
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden';
import { formatCount } from '../../utils/ratings';

const Row = styled.li`
  display: grid;
  grid-template-columns: 1ch 1.15em 1fr minmax(2.5rem, auto);
  align-items: center;
  column-gap: clamp(0.4rem, 2vw, 0.75rem);
  font-size: clamp(0.75rem, 2.6vw, 0.85rem);
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StarValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const CountValue = styled.span`
  color: ${({ theme }) => theme.colors.countText};
`;

const MutedStar = styled(StarIcon)`
  width: 1.15em;
  height: 1.15em;
  color: ${({ theme }) => theme.colors.starMuted};
`;

const Track = styled.span`
  height: 0.6rem;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.track};
  overflow: hidden;
`;

const Fill = styled.span`
  display: block;
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  /* keep tiny shares visible */
  min-width: ${({ $hasReviews }) => ($hasReviews ? '0.25rem' : '0')};
  background: ${({ theme }) => theme.colors.accent};
  border-radius: inherit;
`;

function RatingBar({ stars, count, percentage }) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);
  const rounded = Math.round(safePercentage);

  return (
    <Row>
      <StarValue aria-hidden="true">{stars}</StarValue>
      <MutedStar />
      <Track aria-hidden="true">
        <Fill $percentage={safePercentage} $hasReviews={count > 0} data-testid="rating-bar-fill" />
      </Track>
      <CountValue aria-hidden="true">{formatCount(count)}</CountValue>
      <VisuallyHidden>
        {`${stars} ${stars === 1 ? 'star' : 'stars'}: ${formatCount(count)} ${count === 1 ? 'review' : 'reviews'} (${rounded}%)`}
      </VisuallyHidden>
    </Row>
  );
}

RatingBar.propTypes = {
  stars: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  percentage: PropTypes.number.isRequired,
};

export default RatingBar;
