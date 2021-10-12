import { useSession, signIn, signOut } from 'next-auth/client';
import Head from 'next/head';
import { useState, useEffect } from 'react';

import FilesList from '../components/FilesList';
import Loader from '../components/Loader';
import Upload from '../components/upload/Upload';

export default function Home() {
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

	function Meta() {
		return <>
			<Head>
				<title>Uploader</title>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
				<meta property='og:site_name' content='🟣 >_ Uploader.sonnydata.fr' />
				<meta property='og:title' content='Uploader' />
				<meta property='og:description' content='Uploader sonnydata.fr créé & développé par Sonny#0005. Site privé.' />
				<meta property='og:author' content='Sonny#0005' />
				<meta name='theme-color' content='#fff' />
			</Head>
		</>;
	}

	function Navbar() {
		return <div className='navbar'>
			{session ? <>
				<button onClick={() => signOut()}>Se déconnecter</button>
				<Upload setFiles={setFiles} />
			</> : <>
				Vous n'êtes pas connecté
				<button onClick={() => signIn()}>Se connecter</button>
			</>}
		</div>;
	}

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
			<Navbar />
			{files === null ?
				<div className='no-files'>
					<Loader label='Chargement des fichiers' top={false} />
				</div> : files?.length < 1 || files === undefined ?
					<div className='no-files'>
						<p>Aucun fichier</p>
					</div> :
					<FilesList
						files={files}
						globalSize={globalSize} />}
		</div>
	);
}