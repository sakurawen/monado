import { FC, useEffect, useState } from 'react';
import '@/app.css';

const App: FC = () => {
	const [count] = useState(0);
	useEffect(() => {
		console.log(count);
	}, [count]);
	return (
		<div className='app'>
			<h2 className='text-red-800'>Monado Template</h2>
			<p className='text-sm mt-2'>平平淡淡才是真</p>
		</div>
	);
};

export default App;
