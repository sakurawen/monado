import { StrictMode } from 'react';
import { render } from 'react-dom';
import App from '@/App';
import { BrowserRouter as Router } from 'react-router-dom';
import '@/index.css';

const root = document.querySelector('#root');

render(
	<StrictMode>
		<Router>
			<App />
		</Router>
	</StrictMode>,
	root
);
