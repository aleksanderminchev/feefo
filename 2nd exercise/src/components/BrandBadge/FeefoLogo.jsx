import PropTypes from 'prop-types';
import styled from 'styled-components';

const Svg = styled.svg`
  display: block;
  height: 1.6em;
  width: auto;
  color: ${({ theme }) => theme.colors.text};

  .eyes {
    fill: none;
    stroke: ${({ theme }) => theme.colors.accent};
    stroke-width: 2.6;
  }
`;

function FeefoLogo({ className }) {
  return (
    <Svg className={className} viewBox="0 0 98 32" role="img" aria-label="feefo">
      <text
        x="0"
        y="25"
        fontFamily="Poppins, sans-serif"
        fontSize="28"
        fontWeight="700"
        letterSpacing="-0.5"
        fill="currentColor"
      >
        feefo
      </text>
      <g className="eyes">
        <circle cx="83" cy="9" r="4" />
        <circle cx="91.5" cy="9" r="4" />
      </g>
    </Svg>
  );
}

FeefoLogo.propTypes = {
  className: PropTypes.string,
};

export default FeefoLogo;
