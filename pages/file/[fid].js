import Link from 'next/link';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

import { fileSafeProps } from '../../utils';

import Meta from '../../components/Meta/Meta';
import FilePreview from '../../components/FilePreview/FilePreview';

const prisma = new PrismaClient();

BigInt.prototype.toJSON = function () { return this.toString() }

export default function File({ fid, file, music_recognition, error }) {
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
        console.log('music_recognition', music_recognition);

        const type = file.fileMimeType.split('/')?.[0];
        return (
            <div className='App'>
                <Meta 
                    title={`Uploader • ${file.name}`} 
                    description={file.name}
                    pageUrl={`${process.env.NEXTAUTH_URL}/file/${file.file_id}`} 
                    assetUrl={file.url}
                >
                    {type === 'image' || type === 'video' ? <>
                        <meta property={`og:${type}`} content={file.url} />
                        <meta property={`og:${type}:alt`} content={`${type} content for ${file.name} (${file.file_id})`} />
                        <meta property={`og:${type}:type`} content={file.fileMimeType} />
                    </> : null}
                </Meta>
                <header style={{ justifyContent: 'center' }}>
                    <Link href='/'>
                        <a className='home-link'>Revenir à la page d'accueil</a>
                    </Link>
                </header>
                <div className='file'>
                    {error ? JSON.stringify(error) : <FilePreview file={file} music_recognition={music_recognition} />}
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
        try {
            const url = `${process.env.NEXTAUTH_URL}/file/${file.file_id}`;
            console.log(fileSafe.url, url);
            const { data } = await axios.request({
                method: 'post',
                url: 'https://api.audd.io/',
                data: {
                    url: fileSafe.url,
                    return: 'spotify,youtube',
                    api_token: 'd9cedf345ea8b46bcfe7d6da4ff7035e'
                }
            });
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
        props = { file: null, fid, error: `Impossible de trouver le fichier ${fid}` };
    }

    console.log('props', props);
    return { props };
}