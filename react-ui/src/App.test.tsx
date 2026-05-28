import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome text', () => {
  render(<App />);
  const textElement = screen.getByText(/welcome to your new react app/i);
  expect(textElement).toBeInTheDocument();
});
