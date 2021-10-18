import { stat } from 'fs/promises';
import { File as FileClass } from '../../utils';

import Link from 'next/link';
import Head from 'next/head';

import FilePreview from '../../components/FilePreview';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default function File({ fid, file, error }) {
    function Meta() {
        return <>
            <Head>
                <meta property='og:author' content='Sonny#0005' />
                <meta property='og:site_name' content='🟣 >_ Uploader.sonnydata.fr' />
                <meta charSet='UTF-8' />
                <meta name='viewport' content='initial-scale=1.0, width=device-width' />
                <meta name='theme-color' content='#fff' />

                <meta property='og:url' content='/file/20210227_062940.jpg/' />
                <meta property='og:type' content='website' />

                <title>
                    Uploader {`• ${file ? file.name : fid}`}
                </title>

                {!file ? <>
                    <title>Uploader • {fid}</title>
                    <meta property='og:title' content={`Uploader • ${fid}`} />
                    <meta property='og:description' content='Uploader sonnydata.fr • Fichier introuvable' />
                </> : <>
                    <title>Uploader • {file.name}</title>
                    <meta property='og:title' content={`Uploader • ${file.name}`} />
                    <meta property='og:description' content='Uploader sonnydata.fr' />
                    <meta property='og:image' content={file.url} />
                </>}
            </Head>
        </>;
    }

    function Navbar() {
        return <div className='navbar' style={{ justifyContent: 'center' }}>
            <Link href='/'>
                <a className='home-link'>Revenir à la page d'accueil</a>
            </Link>
        </div>
    }

    console.log(file);

    if (!file) {
        return (
            <div className='App'>
                <Meta />
                <Navbar />
                <div className='file'>
                    Impossible de charge le fichier {fid}
                </div>
            </div>
        );
    } else {
        return (
            <div className='App'>
                <Meta />
                <Navbar />
                <div className='file'>
                    {error
                        ? JSON.stringify(error) : !file
                            ? `Impossible de charger le fichier ${fid}` :
                            <FilePreview file={file} />}
                </div>
            </div>
        );
    }
}

export async function getServerSideProps({ query }) {
    const { fid } = query;
    console.log('fid', fid);
    
    const file = await prisma.file.findUnique({
        where: {
            file_id: fid
        }
    });
    console.log('file', file);
    if (file) { // fichier trouvé

    } else { // fichier non trouvé
        
    }
    
    try {
        const fileStat = await (await stat(`${process.env.UPLOAD_DIR}/${fid}`));
        const file = new FileClass({ fileName: fid, size: fileStat.size, url: process.env.UPLOAD_URL });
        if (!file) {
            return {
                props: {
                    file: null,
                    fid,
                    error: `Impossible de trouver le fichier ${fid}`
                }
            }
        } else {
            return {
                props: {
                    file: JSON.parse(JSON.stringify(file)),
                    fid
                }
            }
        }
    } catch (error) {
        console.error(error);
        return {
            props: {
                file: null,
                fid,
                error: `Impossible de trouver le fichier ${fid} catch`
            }
        }
    }
}