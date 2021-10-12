import { useSession, signIn, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import FilesList from '../components/FilesList';
import Loader from '../components/Loader';

import Navbar from '../components/Navbar';
import Meta from '../components/Meta';

export default function Home() {
    const router = useRouter();
    const [pageLoading, setPageLoading] = useState(false);

	const [session, isLoadingSession] = useSession();
	const [files, setFiles] = useState(null);

	const [globalSize, setGlobalSize] = useState(0);

	useEffect(() => {
		async function getFiles() {
			const request = await fetch('/api/files');
			if (!request.ok)
				return console.error(request);

			const data = await request.json();
			if (!data?.files)
				return setFiles([]);

			let somme = 0;
			data.files.map((file) => somme += parseInt(file?.brutSize, 10));

			setFiles(data.files);
			setGlobalSize(somme);
		}

		getFiles();
		return () => setFiles(null);
	}, [setFiles]);

	useEffect(() => {
        const handleStart = (url) => (url !== router.asPath) && setPageLoading(true);
        const handleComplete = (url) => (url === router.asPath) && setPageLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        }
    });

	if (isLoadingSession && !session) {
		return (
			<div className='App'>
				<Meta />
				<Navbar />
				<Loader label={'Chargement de la session'} top={true} backdrop={true} />
			</div>
		);
	}

	return (
		<div className='App'>
			<Meta />
			<Navbar session={session} signIn={signIn} signOut={signOut} />
			{pageLoading ? 
				<Loader label={'Chargement de la page en cours'} top={true} backdrop={true} /> :
				files === null ?
					<div className='no-files'>
						<Loader label='Chargement des fichiers' top={false} />
					</div> : 
					files?.length < 1 || files === undefined ?
						<div className='no-files'>
							<p>Aucun fichier</p>
						</div> :
						<FilesList files={files} globalSize={globalSize} />}
		</div>
	);
}