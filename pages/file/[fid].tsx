import { NextSeo } from 'next-seo';

import FilePreview from '../../components/FilePreview/FilePreview';
import FileProtected from '../../components/FilePreview/FileProtected';
import MenuNavigation from '../../components/MenuNavigation/MenuNavigation';

import { FileFront, FileType, FrontPageProps } from '../../front.d';
import { prisma } from '../../utils';
import { FileBuilder } from '../../utils/api';

import { OpenGraph, OpenGraphVideo } from 'next-seo/lib/types';
import styles from '../../styles/file-preview/file-preview.module.scss';

// @ts-ignore
BigInt.prototype.toJSON = function () { return this.toString() }

interface FileProps extends FrontPageProps {
    fid: string;
    file: FileFront;
    error?: string;
    transitionClass: string;
}

function FilePage({ fid, file, error, transitionClass }: FileProps) {
    if (!file) {
        return (
            <div className={`${transitionClass} ${styles['App']}`}>
                <NextSeo
                    title={fid}
                    description='• Fichier introuvable'
                />
                <MenuNavigation />
                <div className={styles['file']}>
                    <p>Le fichier <code>{fid}</code> est introuvable</p>
                </div>
            </div>
        );
    }

    const openGraph = {
        type: file.meta.type,
        url: `${process.env.NEXTAUTH_URL}/file/${file.file_id}`
    } as OpenGraph;

    if (file.meta.type === FileType.IMAGE && file.url) {
        openGraph.images = [{
            url: file.url,
            alt: `${file.name} image`,
            type: file.meta.type
        }];
    }

    if (file.meta.type === FileType.VIDEO && file.url) {
        openGraph.type = 'video.other';
        openGraph.video = {
            url: file.url,
            alt: `${file.name} video`
        } as OpenGraphVideo;
    }

    console.log('openGraph file preview', openGraph)

    return (<>
        <div className={`${transitionClass} ${styles['App']}`}>
            <NextSeo
                title={file.name}
                description={`${file.name} • ${file.size.pretty}`}
                openGraph={openGraph}
            />
            <MenuNavigation />
            <div className={styles['file']}>
                {error && (<p>{error}</p>)}
                {!file.passwordSet ? <FilePreview file={file} /> : <FileProtected file={file} />}
            </div>
        </div>
    </>);
}

export async function getServerSideProps({ query }) {
    const { fid } = query;
    const file = await prisma.file.findUnique({
        where: { file_id: fid }
    });

    if (file) {
        const fileSafe = FileBuilder(file);
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

FilePage.authRequired = false;
export default FilePage;