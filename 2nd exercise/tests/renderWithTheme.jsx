import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../src/styles/theme';

export function renderWithTheme(ui, options) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>, options);
}
