import { render, screen } from '@testing-library/react';
import Home from './Home';

test('renders Home without crashing', () => {
	render(<Home />);
});
