import { Provider } from 'next-auth/client';
import { useState } from 'react';

import 'toastr/build/toastr.css';
import '../styles/globals.scss';

import PageLoader from '../components/Loader/Page';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
	const [isTransitioning, setTransitioning] = useState(null);

	const transitionClass = isTransitioning === null ? '' : !isTransitioning ? 'transition-class-in' : 'transition-class-out';
	return (
		<ErrorBoundary>
			<Provider session={pageProps.session} >
				<PageLoader setTransitioning={setTransitioning} />
				<Component transitionClass={transitionClass} {...pageProps} />
			</Provider>
		</ErrorBoundary>
	);
}

export default MyApp;