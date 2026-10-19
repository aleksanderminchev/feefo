import PropTypes from 'prop-types';
import styled from 'styled-components';
import FeefoLogo from './FeefoLogo';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.25rem 0.6rem;
  font-size: clamp(0.95rem, 3.6vw, 1.1rem);
`;

const Title = styled.h2`
  margin: 0;
  font-size: inherit;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

function BrandBadge({ title, headingId }) {
  return (
    <Wrapper>
      <Title id={headingId}>{title}</Title>
      <FeefoLogo />
    </Wrapper>
  );
}

BrandBadge.propTypes = {
  title: PropTypes.string.isRequired,
  headingId: PropTypes.string,
};

export default BrandBadge;
