import { FC } from 'react';
const App: FC = () => {
	return (
		<div>
			<h1>are you ok?</h1>
			<img
				style={{
					height: 140,
				}}
				src={require('./assets/塞尔达.jpg')}
				alt=''
			/>
		</div>
	);
};

export default App;
