import { Provider } from 'next-auth/client';

import 'toastr/build/toastr.css';
import '../styles/globals.scss';
import '../styles/header.scss';
import '../styles/filelist.scss';
import '../styles/file.scss';
import '../styles/upload.scss';

function MyApp({ Component, pageProps }) {
	return (
		<Provider session={pageProps.session} >
			<Component {...pageProps} />
		</Provider>
	)
}

export default MyApp;