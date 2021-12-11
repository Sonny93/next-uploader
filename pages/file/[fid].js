import { useSession } from 'next-auth/client';
import Link from 'next/link';
import axios from 'axios';
import requestip from 'request-ip';

import { prisma, fileSafeProps, createLogHTTP } from '../../utils';

import Meta from '../../components/Meta/Meta';
import MenuNavigation from '../../components/MenuNavigation/MenuNavigation';
import FilePreview from '../../components/FilePreview/FilePreview';
import Loader from '../../components/Loader/Loader';

import styles from '../../styles/file-preview/file-preview.module.scss';

BigInt.prototype.toJSON = function () { return this.toString() }

export default function File({ fid, file, music_recognition, error }) {
	const [session, isLoadingSession] = useSession();

    if (isLoadingSession && !session) { // Chargement session
		return (
			<div className={styles['App']}>
				<Meta />
				<Loader label={'Chargement de la session'} top={true} backdrop={true} />
			</div>
		);
	}

    if (!file) {
        return (
            <div className={styles['App']}>
                <Meta title={`Uploader • ${fid}`} description='• Fichier introuvable' />
                <header>
                    <Link href='/'>
                        <a className={styles['home-link']}>Revenir à la page d'accueil</a>
                    </Link>
                </header>
                <div className={styles['file']}>
                    <p>Le fichier <code>{fid}</code> est introuvable</p>
                </div>
            </div>
        );
    } else {
        const type = file.fileMimeType.split('/')?.[0];
        return (
            <div className={styles['App']}>
                <Meta 
                    title={`Uploader • ${file.name}`} 
                    description={file.name}
                    pageUrl={`${process.env.NEXTAUTH_URL}/file/${file.file_id}`} 
                    assetUrl={file.url}>
                    {type === 'image' || type === 'video' ? <>
                        <meta property={`og:${type}`} content={file.url} />
                        <meta property={`og:${type}:alt`} content={`${type} content for ${file.name} (${file.file_id})`} />
                        <meta property={`og:${type}:type`} content={file.fileMimeType} />
                    </> : null}
                </Meta>
			    <MenuNavigation session={session} />
                <div className={styles['file']}>
                    {error ? <p>{error}</p> : <FilePreview file={file} music_recognition={music_recognition} />}
                </div>
            </div>
        );
    }
}

export async function getServerSideProps({ req, query }) {
    const { fid } = query;
    const file = await prisma.file.findUnique({
        where: { file_id: fid }
    });

    createLogHTTP(req);

    let props;
    if (file) {
        const fileSafe = fileSafeProps(file);
        try {
            const { data } = await axios.request({
                method: 'post',
                url: 'https://api.audd.io/',
                data: {
                    url: fileSafe.url,
                    return: 'spotify,youtube',
                    api_token: 'd9cedf345ea8b46bcfe7d6da4ff7035e'
                }
            });
            console.log(data);
            if (data.status === 'success') {
                props = { 
                    file: JSON.parse(JSON.stringify(fileSafe)), 
                    music_recognition: data.result, 
                    fid
                };
            } else if (data.status === 'error') {
                props = { file: JSON.parse(JSON.stringify(fileSafe)), fid };
            }
        } catch (error) {
            console.error('error', error);
            props = { file: JSON.parse(JSON.stringify(fileSafe)), fid };
        }
    } else {
        props = { file: null, fid, error: `Le fichier ${fid} est introuvable` };
    }

    return { props };
}