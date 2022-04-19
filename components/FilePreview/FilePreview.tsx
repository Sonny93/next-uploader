import Details from './Details';
import Editor from './Editor';
import Image from './Image';
import Video from './Video';
import Audio from './Audio';
import PDFViewer from './PDFViewer';
import FileOther from './FileOther';

import { FileFront, FileType } from '../../front.d';

export default function FilePreview({ file, blob }: { file: FileFront, blob?: string; }): JSX.Element {
    const { url, name, meta } = file;

    let component: JSX.Element;
    if (meta.type === FileType.IMAGE) {
        component = <Image src={url} blob={blob} alt={`Image: ${name}`} />;
    } else if (meta.type === FileType.VIDEO) {
        component = <Video src={url} blob={blob} />;
    } else if (meta.type === FileType.AUDIO) {
        component = <Audio src={url} blob={blob} />;
    } else if (meta.type === FileType.PDF) {
        component = <PDFViewer src={url} blob={blob} />;
    } else if (
        meta.type === FileType.HTML ||
        meta.type === FileType.CSS ||
        meta.type === FileType.SASS ||
        meta.type === FileType.JAVASCRIPT ||
        meta.type === FileType.JSON ||
        meta.type === FileType.REACT ||
        meta.type === FileType.VUEJS ||
        meta.type === FileType.TYPESCRIPT
    ) {
        component = <Editor file={file} blob={blob} />;
    } else {
        component = <FileOther file={file} />;
    }

    return (<>
        <Details file={file} />
        {component}
    </>);
}