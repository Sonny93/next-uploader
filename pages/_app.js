import { Provider } from 'next-auth/client';

import 'toastr/build/toastr.css';
import '../styles/globals.scss';

import PageLoader from '../components/Loader/Page';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
	return (
		<ErrorBoundary>
			<Provider session={pageProps.session} >
				<PageLoader />
				<Component {...pageProps} />
			</Provider>
		</ErrorBoundary>
	);
}

export default MyApp;