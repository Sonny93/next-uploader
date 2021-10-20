import Link from 'next/link';

import { fileSafeProps } from '../../utils';

import Meta from '../../components/Meta';
import FilePreview from '../../components/FilePreview';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

BigInt.prototype.toJSON = function () { return this.toString() }

export default function File({ fid, file, error }) {
    if (!file) {
        return (
            <div className='App'>
                <Meta title={`Uploader • ${fid}`} description='• Fichier introuvable' />
                <header style={{ justifyContent: 'center' }}>
                    <Link href='/'>
                        <a className='home-link'>Revenir à la page d'accueil</a>
                    </Link>
                </header>
                <div className='file'>
                    <div className='file'>Impossible de charge le fichier {fid}</div>
                </div>
            </div>
        );
    } else {
        const type = file.fileMimeType.split('/')?.[0];
        return (
            <div className='App'>
                <Meta 
                    title={`Uploader • ${file.name}`} 
                    description={file.name}
                    pageUrl={`${process.env.NEXTAUTH_URL}/file/${file.file_id}`} 
                    assetUrl={file.url}
                >
                    {type === 'image' || type === 'video' ? <meta property={`og:${type}`} content={assetUrl} /> : null}
                </Meta>
                <header style={{ justifyContent: 'center' }}>
                    <Link href='/'>
                        <a className='home-link'>Revenir à la page d'accueil</a>
                    </Link>
                </header>
                <div className='file'>
                    {error ? JSON.stringify(error) : <FilePreview file={file} />}
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
    const fileSafe = fileSafeProps(file);

    let props;
    if (file) {
        props = { file: JSON.parse(JSON.stringify(fileSafe)), fid };
    } else {
        props = { file: null, fid, error: `Impossible de trouver le fichier ${fid}` };
    }

    return { props };
}