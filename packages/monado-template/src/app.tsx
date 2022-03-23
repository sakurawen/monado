import { FC } from 'react';
import '@/app.css';
import { Routes, Route, Link } from 'react-router-dom';

const App: FC = () => {
	return (
		<div className='app'>
			<h2 className='text-red-800'>Monado Template</h2>
			<p className='text-sm mt-2'>平平淡淡才是真</p>
			<div>
				<Link to='/'>index</Link>
				<Link to='/about'>about</Link>
			</div>
			<Routes>
				<Route path='/' element={<div>index</div>} />
				<Route path='/about' element={<div>about</div>} />
			</Routes>
		</div>
	);
};

export default App;
