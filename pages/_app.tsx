import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { DefaultSeo } from 'next-seo';

import nProgress from 'nprogress';
import 'nprogress/nprogress.css';

import 'toastr/build/toastr.css';
import '../styles/globals.scss';
import '../styles/inputs.scss';

import AuthRequired from '../components/AuthRequired';
import ErrorBoundary from '../components/ErrorBoundary';
import PageLoader from '../components/Loader/Page';

function Application({ Component, pageProps: { session, ...pageProps } }) {
	const [isTransitioning, setTransitioning] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => { // Chargement pages
		router.events.on('routeChangeStart', nProgress.start);
		router.events.on('routeChangeComplete', nProgress.done);
		router.events.on('routeChangeError', nProgress.done);

		return () => {
			router.events.off('routeChangeStart', nProgress.start);
			router.events.off('routeChangeComplete', nProgress.done);
			router.events.off('routeChangeError', nProgress.done);
		}
	});

	const transitionClass = isTransitioning === null ? '' : !isTransitioning ? 'transition-class-in' : 'transition-class-out';
	return (<>
		<DefaultSeo
			titleTemplate='NextUploader — %s'
			description='Drive personnel permettant la mise en ligne de fichiers en tous genres, pour les personnes authentifiées.'
			openGraph={{
				type: 'website',
				locale: 'fr_FR',
				url: process.env.NEXTAUTH_URL,
				images: [{
					url: process.env.NEXTAUTH_URL + '/nu/icons/icon-192x192.png'
				}],
				site_name: 'NextUploader'
			}}
		/>
		<ErrorBoundary>
			<PageLoader setTransitioning={setTransitioning} />
			<SessionProvider session={session}>
				{Component.authRequired ? (
					<AuthRequired>
						<Component transitionClass={transitionClass} {...pageProps} />
					</AuthRequired>
				) : (
					<Component transitionClass={transitionClass} {...pageProps} />
				)}
			</SessionProvider>
		</ErrorBoundary>
	</>);
}

export default Application;