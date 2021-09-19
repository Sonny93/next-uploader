import { Provider } from 'next-auth/client';

import 'toastr/build/toastr.css';
import '../styles/globals.css';
import '../styles/header.css';
import '../styles/upload.css';
import '../styles/filelist.css';
import '../styles/file.css';
import '../styles/modal.css';
import '../styles/modalupload.css';

function MyApp({ Component, pageProps }) {
	return (
		<Provider session={pageProps.session} >
			<Component {...pageProps} />
		</Provider>
	)
}

export default MyApp;