import { useSession, signIn, signOut } from "next-auth/client";
import { useState } from "react";
import Modal from 'react-modal';

import FilesList from "../components/FilesList";
import Upload from "../components/Upload";

export default function Home() {
	const [session, isLoadingSession] = useSession();
	const [files, setFiles] = useState(null);

	function Navbar() {
		if (!session) {
			return <div className='navbar'>
				Vous n'êtes pas connecté <button onClick={() => signIn()}>Se connecter</button>
			</div>;
		} else {
			return <div className='navbar'>
				Vous êtes connecté <button onClick={() => signOut()}>Se déconnecter</button>
				<Upload setFiles={setFiles} />
			</div>;
		}
	}

	return <div className='App'>
		<div className='header'>
			<Navbar />
			<FilesList files={files} setFiles={setFiles} />
		</div>
	</div>
}