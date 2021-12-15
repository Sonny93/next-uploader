import { BiFile } from 'react-icons/bi';

import Details from './Details';
import EditorFile from './Editor';
import Image from './Image';
import Video from './Video';
import Audio from './Audio';

import styles from '../../styles/file-preview/file-preview.module.scss';
import PDFViewer from './PDFViewer';

export default function FilePreview({ file }) {
    const { url, name, fileExtension, fileMimeType } = file;
    const mime = fileMimeType.split('/');
    
    if (mime[0] === 'image') {
        return (<>
            <Image src={url} alt={`Image: ${name}`} />
            <Details file={file} mime={mime} />
        </>);
    } else if (mime[0] === 'video') {
        return (<>
            <Video src={url} />
            <Details file={file} mime={mime} />
        </>);
    } else if (mime[0] === 'audio') {
        return (<>
            <Audio src={url} />
            <Details file={file} mime={mime} />
        </>);
    } else if (fileExtension === 'pdf') {
        return (<>
            <PDFViewer src={url} />
            <Details file={file} mime={mime} />
        </>);
    } else {
        const languageFinded = languages.find(lg => lg.key === fileExtension);
        if (languageFinded) {
            return (<>
                <EditorFile language={languageFinded?.value || languageFinded.key} file={file} />
                <Details file={file} mime={mime} />
            </>);
        } else {
            return (<>
                <div className={styles['preview-wrapper']}>
                    <BiFile style={{ fontSize: '8em' }} />
                </div>
                <Details file={file} mime={mime} />
            </>);
        }
    }
}

/**
 * Liste des langages supportés (avec coloration syntaxique si disponible)
 * @type {Array}
 */
const languages = [
    { key: 'cs', value: 'csharp' },
    { key: 'json' },
    { key: 'plain' },
    { key: 'js', value: 'javascript' },
    { key: 'html' },
    { key: 'css' },
    { key: 'txt', value: 'plain' },
    { key: 'md', value: 'markdown' },
    { key: 'xml' },
    { key: 'lock' }
];