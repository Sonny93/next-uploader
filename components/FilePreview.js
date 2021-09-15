import Image from 'next/image';
import { BiFile } from 'react-icons/bi';

export default function FilePreview({ file, filesLength, index }) {
    const { type, url, name } = file;
    let preview = null;

    if (type === 'image') {
        preview = <Image src={url} alt={`${name} image`} layout='fill' />;
    } else if (type === 'video') {
        preview = <video src={url} />;
    } else if (type === 'audio') {
        preview = <audio src={url}></audio>;
    } else {
        preview = <BiFile />;
    }
    return <>
        <div className='preview-wrapper'>
            {preview}
        </div>
        fichier {index + 1} sur {filesLength}
        <ul>
            {Object.entries(file).map((element, key) => <li key={key}>{element[0]}: {element[1]}</li>)}
        </ul>
    </>;
}