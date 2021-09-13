import { useSession, signIn, signOut } from "next-auth/client";
import { useEffect, useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.css";

export default function Home() {
	const [session, loadingSession] = useSession();
	const [filesUpload, setFilesUpload] = useState(null);
	const [files, setFiles] = useState(null);

	useEffect(async () => {
		const request = await fetch('/api/files');
		if (!request.ok)
			return console.error(request);

		const data = await request.json();
		setFiles(data?.files || []);
	}, []);

	async function upload() {
		if (!filesUpload || filesUpload?.length < 1) return;

		const formData = new FormData();
		Array.from(filesUpload).forEach((file) => formData.append('theFiles', file));

		const request = await fetch('/api/upload', {
			method: 'post',
			body: formData
		});
		
		const data = await request.json();
		setFilesUpload(null);
		
		setFiles(data?.files ? (filesPrev) => {
			const filesToReturn = Array.from(filesPrev);
			for (const file of data?.files) 
				filesToReturn.push(file);
				
			return filesToReturn;
		} : []);
	}

	function Navbar() {
		if (!session) {
			return <div className='navbar'>
				Vous n'êtes pas connecté <button onClick={() => signIn()}>Se connecter</button>
			</div>;
		} else {
			return <div className='navbar'>
				Vous êtes connecté <button onClick={() => signOut()}>Se déconnecter</button>
			</div>;
		}
	}

	const Uploader = () => {
		return <>
			<input type="file" onChange={(event) => setFilesUpload(event.target.files)} multiple={true} />
			<button onClick={upload}>
				Upload
			</button>
		</>;
	}

	console.log('files', files);
	return <div className='App'>
		<div className='header'>
			<Navbar />
			{session && <Uploader />}
		</div>
		<ul className='images'>
			{files && files?.length >= 1 ? <>
				{files.map((file, key) => <li className='image-container' key={key}>
					<img src={file} />
				</li>)}
			</> : 'Aucun fichier'}
		</ul>
	</div>
}
