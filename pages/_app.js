import { Provider } from 'next-auth/client';

import 'toastr/build/toastr.css';
import '../styles/globals.scss';
import '../styles/header.scss';
import '../styles/filelist.scss';
import '../styles/file.scss';
import '../styles/upload.scss';
import '../styles/burger-menu.scss';
import '../styles/error-page.scss';

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