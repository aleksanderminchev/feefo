import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import { renderWithTheme } from '../renderWithTheme';
import App from '../../src/App';
import ProductRating from '../../src/components/ProductRating/ProductRating';
import { theme } from '../../src/styles/theme';

const RATINGS = [
  { stars: 5, count: 952 },
  { stars: 4, count: 171 },
];

describe('Poppins font', () => {
  it('is first in the theme font stack, with system fallbacks', () => {
    const families = theme.font.split(',').map((family) => family.trim());

    expect(families[0]).toBe("'Poppins'");
    expect(families[families.length - 1]).toBe('sans-serif');
  });

  it('is loaded from Google Fonts in every weight the styles use', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

    expect(html).toContain('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700');
  });

  it('is applied to the page body by the global style', () => {
    render(<App />);

    // jsdom doesn't compute inherited fonts
    expect(document.body).toHaveStyleRule('font-family', theme.font, { selector: 'body' });
  });

  it('is applied to the rating card', () => {
    renderWithTheme(<ProductRating ratings={RATINGS} />);

    expect(screen.getByRole('region')).toHaveStyleRule('font-family', theme.font);
  });

  it('is used by the feefo logo text', () => {
    renderWithTheme(<ProductRating ratings={RATINGS} />);
    const logoText = screen.getByRole('img', { name: 'feefo' }).querySelector('text');

    expect(logoText).toHaveAttribute('font-family', 'Poppins, sans-serif');
  });
});
