import { useEffect, useState } from 'react';
import toastr from 'toastr';

import Details from './Details';
import Editor from './Editor';
import Image from './Image';
import Video from './Video';
import Audio from './Audio';
import PDFViewer from './PDFViewer';
import FileOther from './FileOther';

import { FileFront, FileType } from '../../front.d';
import { FetchFile } from '../../utils';
import Loader from '../Loader/Loader';

interface FilePreviewPassword {
    file: FileFront;
    password?: string;
}

export default function FilePreview({ file, password }: FilePreviewPassword): JSX.Element {
    const [loading, setLoading] = useState<boolean>(false);
    const [blob, setBlob] = useState<string | null>(null);
    const [needBlob, setNeedBlob] = useState<boolean>(false);
    const { url, name, meta } = file;

    useEffect(() => {
        if (BlobNeeded(meta.type)) {
            setLoading(true);
            setNeedBlob(true);
            FetchFile({ src: file.url, password })
                .then(setBlob)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [file, password, meta.type]);

    async function handleClickDownload() {
        if (file.meta.type === FileType.PROTECTED && (!password || !file.url)) {
            return toastr.error('Un mot de passe est requis pour télécharger ce fichier !', 'Erreur');
        }

        if (!blob) {
            FetchFile({ src: file.url, password })
                .then((blob) => FileSaveAS(blob, `${name}.${meta.extension}`))
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            FileSaveAS(blob, `${name}.${meta.extension}`);
        }
    }

    if (needBlob && loading) {
        return (<>
            <Details file={file} />
            <Loader label='Téléchargement du fichier en cours' />
        </>);
    }

    let component: JSX.Element;
    if (meta.type === FileType.IMAGE || meta.type === FileType.SVG) {
        component = <Image src={url} blob={blob} alt={`Image: ${name}`} />;
    } else if (meta.type === FileType.VIDEO) {
        component = <Video src={url} blob={blob} />;
    } else if (meta.type === FileType.AUDIO) {
        component = <Audio src={url} blob={blob} />;
    } else if (meta.type === FileType.PDF) {
        component = <PDFViewer src={url} blob={blob} />;
    } else if (
        meta.type === FileType.HTML ||
        meta.type === FileType.XML ||
        meta.type === FileType.CSS ||
        meta.type === FileType.SASS ||
        meta.type === FileType.JAVASCRIPT ||
        meta.type === FileType.JSON ||
        meta.type === FileType.REACT ||
        meta.type === FileType.VUEJS ||
        meta.type === FileType.TYPESCRIPT ||
        meta.type === FileType.SQL ||
        meta.type === FileType.PLAINTEXT
    ) {
        component = <Editor file={file} blob={blob} />;
    } else {
        component = <FileOther file={file} />;
    }

    return (<>
        <Details file={file} />
        <button onClick={handleClickDownload}>
            save
        </button>
        {component}
    </>);
}

function BlobNeeded(type: FileType) {
    if (
        type === FileType.IMAGE ||
        // type === FileType.VIDEO ||
        type === FileType.AUDIO ||
        type === FileType.PDF ||
        type === FileType.HTML ||
        type === FileType.XML ||
        type === FileType.CSS ||
        type === FileType.SASS ||
        type === FileType.JAVASCRIPT ||
        type === FileType.JSON ||
        type === FileType.REACT ||
        type === FileType.VUEJS ||
        type === FileType.SQL ||
        type === FileType.TYPESCRIPT
    ) {
        return true;
    } else {
        return false;
    }
}

function FileSaveAS(blob: string, fileName: string) {
    const a = document.createElement('a');
    a.href = blob;
    a.download = fileName
    a.click();
}