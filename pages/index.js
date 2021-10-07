import { useSession, signIn, signOut } from 'next-auth/client';
import Head from 'next/head';
import { useState, useEffect } from 'react';

import FilesList from '../components/FilesList';
import Loader from '../components/Loader';
import Upload from '../components/upload/Upload';
import { calculSize } from '../utils';

export default function Home() {
	const [session, isLoadingSession] = useSession();
	const [files, setFiles] = useState(null);

	const [isBrowser, setIsBrowser] = useState(false);
	useEffect(() => setIsBrowser(true), []);

    const [globalSize, setGlobalSize] = useState(0);

	function Meta() {
		return <>
			<Head>
				<title>Uploader</title>
				<meta charset='UTF-8' />
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
				<p>{globalSize && files?.length ? `${calculSize(globalSize)} pour ${files.length} fichier${files.length > 1 ? 's' : ''}` : null}</p>
				<Upload isBrowser={isBrowser} setFiles={setFiles} />
			</> : <>
				<button onClick={() => signIn()}>Se connecter</button>
				<p>{globalSize && files?.length ? `${calculSize(globalSize)} pour ${files.length} fichier${files.length > 1 ? 's' : ''}` : null}</p>
				Vous n'êtes pas connecté
			</>}
		</div>;
	}

	console.log(isLoadingSession, session);
	if (isLoadingSession && !session) {
		return <div className='App'>
			<Meta />
			<Navbar />
			<Loader label={'Chargement de la session'} top={true} backdrop={true} />
		</div>;
	}

	return <div className='App'>
		<Meta />
		<Navbar />
		<FilesList 
			isBrowser={isBrowser} 
			files={files} 
			setFiles={setFiles} 
			globalSize={globalSize}
			setGlobalSize={setGlobalSize} />
	</div>
}