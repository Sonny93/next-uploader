import { useSession } from 'next-auth/client';
import { useState, useEffect } from 'react';

import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.extend(require('dayjs/plugin/relativeTime'))
dayjs.locale('fr');

import FilesList from '../components/FilesList/FilesList';
import Loader from '../components/Loader/Loader';
import Meta from '../components/Meta/Meta';
import MenuNavigation from '../components/MenuNavigation/MenuNavigation';

import styles from '../styles/home/home.module.scss';
import stylesFL from '../styles/home/filelist.module.scss';

export default function Home({ transitionClass }) {
	const [session, isLoadingSession] = useSession();
	const [files, setFiles] = useState(null);

	const [globalSize, setGlobalSize] = useState(0);

	useEffect(() => { // Récupération des fichiers
		async function getFiles() {
			const request = await fetch('/api/files');
			if (!request.ok)
				return console.error(request);

			const data = await request.json();
			if (!data?.files)
				return setFiles([]);

			let somme = 0;
			data.files.map((file) => somme += parseInt(file?.fileBrutSize, 10));

			setFiles(data.files);
			setGlobalSize(somme);
		}

		getFiles();
		return () => setFiles(null);
	}, [setFiles]);

	if (isLoadingSession && !session) { // Chargement session
		return (
			<div className={`${transitionClass} ${styles['App']}`}>
				<Meta />
				<Loader label={'Chargement de la session'} top={true} backdrop={true} />
			</div>
		);
	}

	return (
		<div className={`${transitionClass} ${styles['App']}`}>
			<Meta />
			<MenuNavigation session={session} />
			<div className={styles['wrapper']}>
				{files === null ?
					<div className={stylesFL['no-files']}>
						<Loader label='Chargement des fichiers' top={false} />
					</div> :
					files?.length < 1 || files === undefined ?
						<div className={stylesFL['no-files']}>
							<p>Aucun fichier</p>
						</div> :
						<FilesList files={files} globalSize={globalSize} />}
			</div>
		</div>
	);
}