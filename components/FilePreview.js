import React from 'react';
import ReactPlayer from 'react-player/lazy';
import { BiFile } from 'react-icons/bi';

export default function FilePreview({ file }) {
    const { type, url, name, extension, size } = file;
    let preview = null;

    if (type === 'image') {
        preview = <img src={url} alt={`${name} image`} />;
    } else if (type === 'video') {
        preview = <ReactPlayer url={url} playing />;
    } else if (type === 'audio') {
        preview = <audio src={url} controls />;
    } else {
        preview = <BiFile />;
    }
    return <>
        <div className='preview-wrapper'>
            {preview}
        </div>
        <ul>
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