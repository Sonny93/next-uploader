import { useSession } from 'next-auth/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma, fileSafeProps } from '../../utils';

import Meta from '../../components/Meta/Meta';
// @ts-ignore
import MenuNavigation from '../../components/MenuNavigation/MenuNavigation.tsx';
import FilePreview from '../../components/FilePreview/FilePreview';
import Loader from '../../components/Loader/Loader';

// @ts-ignore
import styles from '../../styles/file-preview/file-preview.module.scss';

// @ts-ignore
BigInt.prototype.toJSON = function () { return this.toString() }

interface FileProps {
    fid: string;
    file: any;
    error?: string;
    transitionClass: string;
}
export default function File({ fid, file, error, transitionClass }: FileProps) {
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

export async function getServerSideProps({ query }) {
    const { fid } = query;
    const file = await prisma.file.findUnique({
        where: { file_id: fid }
    });

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