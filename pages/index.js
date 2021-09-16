import { useSession, signIn, signOut } from 'next-auth/client';
import { useState, useEffect } from 'react';

import FilesList from '../components/FilesList';
import Loader from '../components/Loader';
import Upload from '../components/upload/Upload';

export default function Home() {
	const [session, isLoadingSession] = useSession();
	const [files, setFiles] = useState(null);

    const [isBrowser, setIsBrowser] = useState(false);
    useEffect(() => setIsBrowser(true), []);

	function Navbar() {
		return <div className='navbar'>
			{session ? <>
				<button onClick={() => signOut()}>Se déconnecter</button>
				<Upload isBrowser={isBrowser} setFiles={setFiles} />
			</> : <>
				<button onClick={() => signIn()}>Se connecter</button>
				Vous n'êtes pas connecté
			</>}
		</div>;
	}

	if (isLoadingSession) {
		return <div className='App'>
			<Navbar />
			<Loader top={true} backdrop={true} />
		</div>;
	}

	return <div className='App'>
		<Navbar />
		<FilesList isBrowser={isBrowser} files={files} setFiles={setFiles} />
	</div>
}