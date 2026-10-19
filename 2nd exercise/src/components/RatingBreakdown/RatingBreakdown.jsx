import PropTypes from 'prop-types';
import styled from 'styled-components';
import RatingBar from './RatingBar';

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: clamp(0.6rem, 2.4vw, 0.85rem);
  margin: 0;
  padding: 0;
  list-style: none;
`;

function RatingBreakdown({ breakdown }) {
  return (
    <List role="list" aria-label="Rating breakdown">
      {breakdown.map(({ stars, count, percentage }) => (
        <RatingBar key={stars} stars={stars} count={count} percentage={percentage} />
      ))}
    </List>
  );
}

RatingBreakdown.propTypes = {
  breakdown: PropTypes.arrayOf(
    PropTypes.shape({
      stars: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
      percentage: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default RatingBreakdown;
