import React from 'react';
import { render } from 'react-dom';
import App from '@/App';
import { BrowserRouter as Router } from 'react-router-dom';
import '@/index.css';

const root = document.querySelector('#root');

render(
	<React.StrictMode>
		<Router>
			<App />
		</Router>
	</React.StrictMode>,
	root
);
