import { useSession, signIn, signOut } from "next-auth/client";
import { useState, useEffect } from "react";
import FilesList from "../components/FilesList";
import Upload from "../components/Upload";

export default function Home() {
	const [session, isLoadingSession] = useSession();
	const [files, setFiles] = useState(null);
	const [filesUpload, setFilesUpload] = useState(null);

	function Navbar() {
		return <div className='navbar'>
			<div>
				Vous êtes connecté <button onClick={() => signOut()}>Se déconnecter</button>
			</div>
			{session && <Upload setFiles={setFiles} filesUpload={filesUpload} setFilesUpload={setFilesUpload} />}
		</div>;
	}

	console.log(files);
	return <div className='App'>
		<div className='header'>
			<Navbar />
		</div>
		<FilesList files={files} setFiles={setFiles} />
	</div>
}