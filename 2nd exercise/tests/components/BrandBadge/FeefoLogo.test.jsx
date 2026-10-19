import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../renderWithTheme';
import FeefoLogo from '../../../src/components/BrandBadge/FeefoLogo';

describe('FeefoLogo', () => {
  it('is an image named "feefo" for screen readers', () => {
    renderWithTheme(<FeefoLogo />);
    expect(screen.getByRole('img', { name: 'feefo' })).toBeInTheDocument();
  });

  it('draws the word mark and the two eyes', () => {
    renderWithTheme(<FeefoLogo />);
    const logo = screen.getByRole('img', { name: 'feefo' });

    expect(logo.querySelector('text')).toHaveTextContent('feefo');
    expect(logo.querySelectorAll('.eyes circle')).toHaveLength(2);
  });

  it('passes the className through so a parent can style it', () => {
    renderWithTheme(<FeefoLogo className="custom-logo" />);
    expect(screen.getByRole('img', { name: 'feefo' })).toHaveClass('custom-logo');
  });
});
