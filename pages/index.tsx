import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

import { ImFileEmpty } from "react-icons/im";

import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)
dayjs.locale('fr');

import FilesList from '../components/Home/FilesList';
import Loader from '../components/Loader/Loader';
import Meta from '../components/Meta/Meta';

import MenuNavigation from '../components/MenuNavigation/MenuNavigation';

import styles from '../styles/home/home.module.scss';
import stylesFL from '../styles/home/filelist.module.scss';

import { FileFront, FrontPageProps } from '../front';

export default function Home({ transitionClass }: FrontPageProps) {
	const { data: session, status } = useSession();

	const [files, setFiles] = useState<FileFront[] | null>(null);
	const [globalSize, setGlobalSize] = useState<number>(0);

	useEffect(() => { // Récupération des fichiers
		async function getFiles() {
			const request = await fetch('/api/files');
			if (!request.ok) {
				return console.error(request);
			}

			const data = await request.json();
			if (Array.isArray(data?.files) && data?.files?.length === 0) {
				return setFiles([]);
			}

			const somme = [...data.files]
				.map(({ size, passwordSet }: FileFront) => Number(!passwordSet ? size.raw : 0))
				.reduce((a, b) => a += b);

			setFiles(data.files);
			setGlobalSize(somme);
		}

		getFiles();
		return () => setFiles(null);
	}, [setFiles]);

	if (status === 'loading' && !session) {
		return (
			<div className={`${transitionClass} ${styles['App']}`}>
				<Meta />
				<Loader label={'Session en cours de chargement'} backdrop={true} />
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
						<Loader label='Récupération des fichiers' />
					</div> :
					files?.length === 0 ?
						<NoFile /> :
						<FilesList files={files} globalSize={globalSize} />}
			</div>
		</div>
	);
}

function NoFile() {
	return (
		<div className={stylesFL['no-files']}>
			<ImFileEmpty />
			<span>
				Aucun fichier
			</span>
		</div>
	)
}