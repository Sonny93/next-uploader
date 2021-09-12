import { useSession, signIn, signOut } from "next-auth/client";
import { useState } from "react";
import { readdir } from 'fs/promises';

const files = [];
readdir('./public/uploads').then((file) => files.push(require(file)));

export default function Home() {
	const [session, loadingSession] = useSession();
	const [filesUpload, setFilesUpload] = useState(null);

	if (!session) {
		return <div className='App'>
			Vous n'êtes pas connecté <button onClick={() => signIn()}>Se connecter</button>
		</div>
	}

	async function upload() {
		if (!filesUpload || filesUpload?.length < 1) return;

		const formData = new FormData();
		Array.from(filesUpload).forEach((file) => formData.append('theFiles', file));
		console.log(filesUpload);

		const request = await fetch('/api/upload', { 
			method: 'post',
			body: formData
		});
		const data = await request.json();
		console.log(data);
		setFilesUpload(null);
	}

	return <div className='App'>
		Vous êtes connecté <button onClick={() => signOut()}>Se déconnecter</button>
		<input type="file" onChange={(event) => setFilesUpload(event.target.files)} multiple={true} />
		<button onClick={upload}>
			Upload
		</button>
			{files && files?.length < 1 ? <>
				{files.map((file, key) => <img key={key} src={file} />)}
			</> : 'no files'}
	</div>
}
