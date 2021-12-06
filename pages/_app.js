import { Provider } from 'next-auth/client';

import 'toastr/build/toastr.css';
import '../styles/globals.scss';
import '../styles/upload.scss';
import '../styles/error-page.scss';
import '../styles/admin/admin.scss';

import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
	return (
		<ErrorBoundary>
			<Provider session={pageProps.session} >
				<Component {...pageProps} />
			</Provider>
		</ErrorBoundary>
	);
}

export default MyApp;