import { render } from '@testing-library/react';
import App from './App';

test('renders an empty page', () => {
  const { container } = render(<App />);
  expect(container.firstChild).toBeNull();
});
