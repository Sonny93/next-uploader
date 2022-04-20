import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';

import 'toastr/build/toastr.css';
import '../styles/globals.scss';
import '../styles/inputs.scss';

import PageLoader from '../components/Loader/Page';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
	const [isTransitioning, setTransitioning] = useState<boolean | null>(null);

	const transitionClass = isTransitioning === null ? '' : !isTransitioning ? 'transition-class-in' : 'transition-class-out';
	return (
		<ErrorBoundary>
			<SessionProvider session={pageProps.session} >
				<PageLoader setTransitioning={setTransitioning} />
				<Component transitionClass={transitionClass} {...pageProps} />
			</SessionProvider>
		</ErrorBoundary>
	);
}

export default MyApp;