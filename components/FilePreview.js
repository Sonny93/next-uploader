import Image from 'next/image';
import { BiFile } from 'react-icons/bi';

export default function FilePreview({ file }) {
    const { type, url, name, extension, size } = file;
    let preview = null;

    if (type === 'image') {
        preview = <Image src={url} alt={`${name} image`} layout='fill' />;
    } else if (type === 'video') {
        preview = <video src={url} controls />;
    } else if (type === 'audio') {
        preview = <audio src={url} controls></audio>;
    } else {
        preview = <BiFile />;
    }
    return <>
        <div className='preview-wrapper'>
            {preview}
        </div>
        <ul>
            <li style={{ textAlign: 'center' }}>
                <a href={url} style={{ fontStyle: 'italic', color: 'gray', fontSize: '.9em' }}>
                    {url}
                </a>
            </li>
            <li>
                {name}
            </li>
            <li>
                Type: {type}/{extension}
            </li>
            <li>
                Taille: {size}
            </li>
        </ul>
    </>;
}