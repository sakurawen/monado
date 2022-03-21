import { FC } from 'react';
import style from './index.module.css';
const App: FC = () => {
	return (
		<div>
			<h1 className={style.wuhu}>are you ok?</h1>
			<img
				style={{
					height: 140,
				}}
				src={require('./assets/塞尔达.jpg')}
				alt=''
			/>
			<div
				className={style.giao}
				style={{
					height: '400px',
					width: '400px',
				}}
			></div>
		</div>
	);
};

export default App;
