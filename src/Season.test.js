import { render, screen } from '@testing-library/react';
import Home from './Home';

test('renders Season without crashing', () => {
	render(<Home />);
});
