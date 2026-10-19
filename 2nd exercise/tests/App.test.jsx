import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders the product rating inside the main landmark', () => {
    render(<App />);
    expect(screen.getByRole('main')).toContainElement(
      screen.getByRole('region', { name: 'Product Rating' }),
    );
  });
});
