import { useSession, signIn, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { AiFillFileAdd } from 'react-icons/ai';
import Link from 'next/link';

import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.extend(require('dayjs/plugin/relativeTime'))
dayjs.locale('fr');

import FilesList from '../components/FilesList/FilesList';
import Loader from '../components/Loader';
import Meta from '../components/Meta/Meta';

export default function Home() {
    const router = useRouter();
    const [pageLoading, setPageLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
	
    const [isMenuOpen, setMenuOpen] = useState(false);

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

	useEffect(() => { // Chargement pages
        const handleStart = (url) => (url !== router.asPath) && setPageLoading(true);
        const handleComplete = (url) => (url === router.asPath) && setPageLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        }
    });

	if (isLoadingSession && !session) { // Chargement session
		return (
			<div className='App'>
				<Meta />
				<Loader label={'Chargement de la session'} top={true} backdrop={true} />
			</div>
		);
	}

	const toggleMenu = () => setMenuOpen(prev => !prev);
	return (
		<div className='App'>
			<Meta />
			<header>
				<button onClick={toggleMenu}>
					{isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
				</button>
			</header>
			<ul className='menu' style={{ display: isMenuOpen ? 'flex' : 'none'}}>
				<header>
					<button onClick={toggleMenu}>
						{isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
					</button>
				</header>
				<li className='item'>
					<Link href='#'>
						{!showFilter ?
							<a onClick={() => {
								setShowFilter(true);
								setMenuOpen(false);
							}}>Afficher les filtres de recherche</a> :
							<a onClick={() => {
								setShowFilter(false);
								setMenuOpen(false);
							}}>Masquer les filtres de recherche</a>}
					</Link>
				</li>
				{session ? <>
					<li className='item'>
						<Link href='/#'>
							<a onClick={() => setMenuOpen(false)}>Créer un fichier</a>
						</Link>
					</li>
					<li className='item'>
						<Link href='/upload'>
							<a onClick={() => setMenuOpen(false)}><AiFillFileAdd /> Uploader un fichier</a>
						</Link>
					</li>
					<li className='item'>
						<Link href='#'>
							<a onClick={() => {
								signOut();
								setMenuOpen(false);
							}} style={{ background: 'crimson', textTransform: 'uppercase' }}>Se déconnecter</a>
						</Link>
					</li>
				</> : <>
					<li className='item'>
						<Link href='#'>
							<a onClick={() => {
								signIn();
								setMenuOpen(false);
							}}>Se connecter</a>
						</Link>
					</li>
				</>}
			</ul>
			{pageLoading ? 
				<Loader label={'Chargement de la page en cours'} top={true} backdrop={true} /> :
				files === null ?
					<div className='no-files'>
						<Loader label='Chargement des fichiers' top={false} />
					</div> : 
					files?.length < 1 || files === undefined ?
						<div className='no-files'>
							<p>Aucun fichier</p>
						</div> :
						<FilesList showFilter={showFilter} files={files} globalSize={globalSize} />}
		</div>
	);
}