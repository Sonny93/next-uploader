import { useSession } from 'next-auth/client';
import Link from 'next/link';
import axios from 'axios';

import { prisma, fileSafeProps, createLogHTTP } from '../../utils';

import Meta from '../../components/Meta/Meta';
import MenuNavigation from '../../components/MenuNavigation/MenuNavigation';
import FilePreview from '../../components/FilePreview/FilePreview';
import Loader from '../../components/Loader/Loader';

import styles from '../../styles/file-preview/file-preview.module.scss';

BigInt.prototype.toJSON = function () { return this.toString() }

export default function File({ fid, file, error, transitionClass }) {
    const [session, isLoadingSession] = useSession();

    if (isLoadingSession && !session) { // Chargement session
        return (
            <div className={`${transitionClass} ${styles['App']}`}>
                <Meta />
                <Loader label={'Chargement de la session'} top={true} backdrop={true} />
            </div>
        );
    }

    if (!file) {
        return (
            <div className={`${transitionClass} ${styles['App']}`}>
                <Meta title={`Uploader • ${fid}`} description='• Fichier introuvable' />
                <MenuNavigation session={session} />
                <div className={styles['file']}>
                    <p>Le fichier <code>{fid}</code> est introuvable</p>
                </div>
            </div>
        );
    } else {
        const type = file.fileMimeType.split('/')?.[0];
        return (
            <div className={`${transitionClass} ${styles['App']}`}>
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
                    {error ? <p>{error}</p> : <FilePreview file={file} />}
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

    if (file) {
        const fileSafe = fileSafeProps(file);
        return {
            props: {
                file: JSON.parse(JSON.stringify(fileSafe)),
                fid
            }
        };
    } else {
        return {
            props: {
                file: null,
                fid,
                error: `Le fichier ${fid} est introuvable`
            }
        };
    }
}