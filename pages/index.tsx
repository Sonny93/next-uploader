import { useEffect, useState } from 'react';

import { ImFileEmpty } from 'react-icons/im';

import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
dayjs.locale('fr');

import FilesList from '../components/Home/FilesList';
import Loader from '../components/Loader/Loader';

import MenuNavigation from '../components/MenuNavigation/MenuNavigation';

import stylesFL from '../styles/home/filelist.module.scss';
import styles from '../styles/home/home.module.scss';

import { FileFront, FrontPageProps } from '../front';

function HomePage({ transitionClass }: FrontPageProps) {
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

	return (
		<div className={`${transitionClass} ${styles['App']}`}>
			<MenuNavigation />
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

HomePage.authRequired = true;
export default HomePage;