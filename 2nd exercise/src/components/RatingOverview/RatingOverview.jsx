import PropTypes from 'prop-types';
import styled from 'styled-components';
import StarRating from '../StarRating/StarRating';
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden';
import { MAX_STARS, formatCount, getRatingLabel } from '../../utils/ratings';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.6rem, 2.5vw, 0.9rem);
  text-align: center;
`;

// uppercase in CSS so screen readers don't spell it out
const Label = styled.p`
  margin: 0;
  font-size: clamp(1.1rem, 4vw, 1.4rem);
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

const Score = styled.p`
  margin: 0;
  font-size: clamp(0.75rem, 2.6vw, 0.875rem);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

function RatingOverview({ average, total }) {
  return (
    <Wrapper>
      <Label>{getRatingLabel(average, total)}</Label>
      <StarRating rating={average} max={MAX_STARS} />
      <Score aria-hidden="true">{`${average.toFixed(1)} out of ${MAX_STARS}`}</Score>
      <VisuallyHidden>{`Based on ${formatCount(total)} ${total === 1 ? 'review' : 'reviews'}`}</VisuallyHidden>
    </Wrapper>
  );
}

RatingOverview.propTypes = {
  average: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default RatingOverview;
