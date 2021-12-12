import { Provider } from 'next-auth/client';

import 'toastr/build/toastr.css';
import '../styles/globals.scss';

import PageLoader from '../components/Loader/Page';
import ErrorBoundary from '../components/ErrorBoundary';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
	const [isTransitioning, setTransitioning] = useState(null);

	return (
		<ErrorBoundary>
			<Provider session={pageProps.session} >
				<PageLoader setTransitioning={setTransitioning} />
				<Component transitionClass={isTransitioning === null ? '' : !isTransitioning ? 'transition-class-in' : 'transition-class-out' } {...pageProps} />
			</Provider>
		</ErrorBoundary>
	);
}

export default MyApp;