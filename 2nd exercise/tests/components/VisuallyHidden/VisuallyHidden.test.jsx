import { render, screen } from '@testing-library/react';
import VisuallyHidden from '../../../src/components/VisuallyHidden/VisuallyHidden';

describe('VisuallyHidden', () => {
  it('keeps its text in the document for screen readers', () => {
    render(<VisuallyHidden>4.6 out of 5 stars</VisuallyHidden>);
    expect(screen.getByText('4.6 out of 5 stars')).toBeInTheDocument();
  });

  it('removes the content from the visual layout', () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    const element = screen.getByText('Hidden text');

    expect(element).toHaveStyleRule('position', 'absolute');
    expect(element).toHaveStyleRule('width', '1px');
    expect(element).toHaveStyleRule('height', '1px');
    expect(element).toHaveStyleRule('overflow', 'hidden');
    expect(element).toHaveStyleRule('clip', 'rect(0 0 0 0)');
  });

  it('does not use display: none, which would hide it from screen readers too', () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    expect(screen.getByText('Hidden text')).not.toHaveStyleRule('display', 'none');
  });
});
