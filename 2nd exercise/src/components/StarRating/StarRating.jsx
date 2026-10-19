import PropTypes from 'prop-types';
import styled from 'styled-components';
import StarIcon from './StarIcon';
import { MAX_STARS, starFill } from '../../utils/ratings';

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, 1fr);
  gap: clamp(0.2rem, 1vw, 0.3rem);
  width: min(100%, 15rem);
  margin-inline: auto;
`;

const StarTile = styled.span`
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radius.tile};
  color: ${({ theme }) => theme.colors.surface};
  /* hard stop = partial fill */
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.accent} ${({ $fill }) => $fill}%,
    ${({ theme }) => theme.colors.starMuted} ${({ $fill }) => $fill}%
  );

  svg {
    width: 62%;
    height: 62%;
  }
`;

function StarRating({ rating, max = MAX_STARS }) {
  const clamped = Math.min(Math.max(rating, 0), max);

  return (
    <Row role="img" aria-label={`Rated ${clamped} out of ${max} stars`} $count={max}>
      {Array.from({ length: max }, (_, index) => (
        <StarTile key={index} $fill={Math.round(starFill(clamped, index) * 100)} data-testid="star-tile">
          <StarIcon />
        </StarTile>
      ))}
    </Row>
  );
}

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  max: PropTypes.number,
};

export default StarRating;
