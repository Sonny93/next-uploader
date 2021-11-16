import { Provider } from 'next-auth/client';

import 'toastr/build/toastr.css';
import '../styles/globals.scss';
import '../styles/header.scss';
import '../styles/filelist.scss';
import '../styles/file.scss';
import '../styles/upload.scss';
import '../styles/burger-menu.scss';
import '../styles/error-page.scss';
import '../styles/admin.scss';

import ErrorBoundary from '../components/ErrorBoundary';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', function () {
				navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).then((registration) => {
					console.log('SW registered: ', registration)
				}).catch(function (registrationError) {
					console.log('SW registration failed: ', registrationError)
				});
			})
		}
	});

	return (
		<ErrorBoundary>
			<Provider session={pageProps.session} >
				<Component {...pageProps} />
			</Provider>
		</ErrorBoundary>
	);
}

export default MyApp;