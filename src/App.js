import './App.css';
import Header from './Header';
import Home from './Home';
import Season from './Season';
import {
	Switch,
	BrowserRouter as Router,
	Route
} from 'react-router-dom';

function App() {
	return (
		<Router>
			<Header />
			<div style={{ position: 'relative', padding: '80px 20px 20px 20px' }}>
				<Switch>
					<Route exact path="/season">
						<Season />
					</Route>
					<Route exact path="/season/:year">
						<Season />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
