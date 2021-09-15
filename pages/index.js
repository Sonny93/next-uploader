import { useSession, signIn, signOut } from "next-auth/client";
import { useState, useEffect } from "react";
import FilesList from "../components/FilesList";
import Upload from "../components/Upload";

export default function Home() {
	const [session, isLoadingSession] = useSession();
	const [files, setFiles] = useState(null);
	const [filesUpload, setFilesUpload] = useState(null);

    const [isBrowser, setIsBrowser] = useState(false);
    useEffect(() => setIsBrowser(true), []);

	function Navbar() {
		return <div className='navbar'>
			{session ? <>
				<button onClick={() => signOut()}>Se déconnecter</button>
				<Upload isBrowser={isBrowser} setFiles={setFiles} filesUpload={filesUpload} setFilesUpload={setFilesUpload} />
			</> : <>
				<button onClick={() => signIn()}>Se connecter</button>
				Vous n'êtes pas connecté
			</>}
		</div>;
	}

	return <div className='App'>
		<div className='header'>
			<Navbar />
		</div>
		<FilesList isBrowser={isBrowser} files={files} setFiles={setFiles} />
	</div>
}