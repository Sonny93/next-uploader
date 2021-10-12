import React, { useEffect, useRef, useState } from 'react';
// import ReactPlayer from 'react-player/lazy';
import { BiFile } from 'react-icons/bi';
import Loader from './Loader';

export default function FilePreview({ file }) {
    const { type, url, name, extension, size } = file;
    const contentRef = useRef();
    const [loadingContent, setLoading] = useState(false);

    useEffect(() => {
        if (!contentRef.current) return;
        contentRef.current.addEventListener('load', (event))
    }, [setLoading]);

    return <>
        <div className='preview-wrapper'>
            {type === 'image' ?
                <img ref={contentRef} src={url} alt={`${name} image`} /> :
             type === 'video' ?
                <video ref={contentRef} src={url} autoPlay controls /> :
             type === 'audio ?' ?
                <audio ref={contentRef} src={url} controls /> :
                <BiFile style={{ fontSize: '8em' }} />}
            {loadingContent && <Loader top={true} backdrop={true} />}
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